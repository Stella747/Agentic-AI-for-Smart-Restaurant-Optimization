import pandas as pd
import json
import os

for file in os.listdir("drafts/kb_excel_files"):
    if file.endswith(".xlsx"):
        file_path = os.path.join("drafts/kb_excel_files", file)
        jsonl_file = os.path.join("drafts/kb_excel_files", file.replace(".xlsx", ".jsonl"))
        print(f"Converting {os.path.abspath(file_path)} to JSONL format...")
        df = pd.read_excel(file_path, sheet_name=0)
        with open(jsonl_file, "w", encoding="utf-8") as f:
            for record in df.to_dict(orient="records"):
                f.write(json.dumps(record, ensure_ascii=False, default=str) + "\n")
