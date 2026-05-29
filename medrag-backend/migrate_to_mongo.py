import asyncio
import os
import motor.motor_asyncio
from config import config
import datetime

async def migrate_to_mongodb():
    if not config.MONGODB_URL:
        print("MONGODB_URL not found in environment. Please add it first.")
        return

    print("Starting migration of policy files to MongoDB...")
    client = motor.motor_asyncio.AsyncIOMotorClient(config.MONGODB_URL)
    db = client[config.MONGODB_DB_NAME]
    fs = motor.motor_asyncio.AsyncIOMotorGridFSBucket(db)

    policies_dir = "policies"
    if not os.path.exists(policies_dir):
        print(f"{policies_dir} directory not found.")
        return

    files = [f for f in os.listdir(policies_dir) if os.path.isfile(os.path.join(policies_dir, f))]
    
    for filename in files:
        file_path = os.path.join(policies_dir, filename)
        
        # Check if already exists in Mongo
        existing = await db.fs.files.find_one({"filename": filename})
        if existing:
            print(f"{filename} already exists in MongoDB. Skipping.")
            continue

        print(f"Uploading {filename}...")
        
        # Simple heuristics for metadata (matching upload.py)
        fn_lower = filename.lower()
        company = filename.split('_')[0] if "_" in filename else filename.split("-")[0]
        category = "Government Schemes" if ("bharat" in fn_lower or "ayushman" in fn_lower) else "Private Plans"
        
        metadata = {
            "upload_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "company": company,
            "category": category,
            "filename": filename,
            "user_id": "public"
        }

        with open(file_path, "rb") as f:
            await fs.upload_from_stream(
                filename,
                f.read(),
                metadata=metadata
            )
        print(f"{filename} migrated successfully.")

    print("Migration finished!")

if __name__ == "__main__":
    asyncio.run(migrate_to_mongodb())
