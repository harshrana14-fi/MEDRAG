# pyrefly: ignore [missing-import]
import motor.motor_asyncio
from config import config
import os

class MongoDBService:
    def __init__(self):
        self._client = None
        self._db = None
        self._fs = None

    @property
    def client(self):
        if self._client is None and config.MONGODB_URL:
            self._client = motor.motor_asyncio.AsyncIOMotorClient(config.MONGODB_URL)
        return self._client

    @property
    def db(self):
        if self._db is None and self.client is not None:
            self._db = self.client[config.MONGODB_DB_NAME]
        return self._db

    @property
    def fs(self):
        if self._fs is None and self.db is not None:
            # GridFSBucket for async file storage
            self._fs = motor.motor_asyncio.AsyncIOMotorGridFSBucket(self.db)
        return self._fs

    async def upload_file(self, file_content, filename, metadata=None):
        if not self.fs:
            print("MongoDB/GridFS not initialized")
            return None
        
        # Check if file exists and delete old version
        cursor = self.db.fs.files.find({"filename": filename})
        async for doc in cursor:
            await self.fs.delete(doc["_id"])

        grid_in = await self.fs.upload_from_stream(
            filename,
            file_content,
            metadata=metadata
        )
        return grid_in

    async def get_file(self, filename):
        if not self.fs:
            return None
        
        try:
            grid_out = await self.fs.open_download_stream_by_name(filename)
            return await grid_out.read()
        except Exception:
            return None

    async def delete_file(self, filename):
        if not self.fs:
            return
        
        cursor = self.db.fs.files.find({"filename": filename})
        async for doc in cursor:
            await self.fs.delete(doc["_id"])

    async def list_files(self):
        if not self.db:
            return []
        files = []
        cursor = self.db.fs.files.find({})
        async for doc in cursor:
            files.append({
                "filename": doc["filename"],
                "uploadDate": doc["uploadDate"],
                "metadata": doc.get("metadata", {})
            })
        return files

mongodb_service = MongoDBService()
