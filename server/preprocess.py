import sqlite3

import pandas as pd

CSV_PATH = "data/Factors.csv"
DB_PATH = "factors.db"

df = pd.read_csv(CSV_PATH)
print(f"Количество строк при загрузке: {len(df)}")

df = df.dropna().drop_duplicates()
print(f"Количество строк после очистки: {len(df)}")

df = df[df["Exam_Score"].between(0, 100)]
print(f"Количество строк после фильтрации по оценке: {len(df)}")

for col in [
    "Extracurricular_Activities",
    "Internet_Access",
    "Learning_Disabilities",
]:
    df[col] = (df[col].str.strip().str.lower() == "yes").astype(int)

maps = {
    "Parental_Involvement": {"Low": 0, "Medium": 1, "High": 2},
    "Access_to_Resources": {"Low": 0, "Medium": 1, "High": 2},
    "Motivation_Level": {"Low": 0, "Medium": 1, "High": 2},
    "Family_Income": {"Low": 0, "Medium": 1, "High": 2},
    "Teacher_Quality": {"Low": 0, "Medium": 1, "High": 2},
    "Parental_Education_Level": {
        "High School": 0,
        "College": 1,
        "Postgraduate": 2,
    },
    "Distance_from_Home": {"Near": 0, "Moderate": 1, "Far": 2},
    "Peer_Influence": {"Negative": 0, "Neutral": 1, "Positive": 2},
    "Gender": {"Female": 0, "Male": 1},
    "School_Type": {"Private": 0, "Public": 1},
}
for col, m in maps.items():
    df[col] = df[col].str.strip().map(m)

df.columns = df.columns.str.lower()

conn = sqlite3.connect(DB_PATH)
df.to_sql("students", conn, if_exists="replace", index=False)
conn.close()
print(f"Сохранено в {DB_PATH}")
