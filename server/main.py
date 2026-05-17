import sqlite3

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

DB_PATH = "factors.db"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CORRELATION_EXCLUDE = {"gender", "school_type"}


def get_df() -> pd.DataFrame:
    try:
        conn = sqlite3.connect(DB_PATH)
        df = pd.read_sql("SELECT * FROM students", conn)
        conn.close()
        return df
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}") from e


@app.get("/correlations")
def correlations():
    df = get_df()
    numeric = df.select_dtypes(include="number")
    cols = [
        c
        for c in numeric.columns
        if c != "exam_score" and c not in CORRELATION_EXCLUDE
    ]
    result = [
        {
            "factor": c,
            "r": float(round(numeric[c].corr(numeric["exam_score"]), 3)),
        }
        for c in cols
    ]
    return sorted(result, key=lambda x: x["r"])


def _group_mean(df: pd.DataFrame, column: str) -> list[dict]:
    grp = (
        df.groupby(column)["exam_score"]
        .mean()
        .round(1)
        .reset_index()
        .rename(columns={"exam_score": "avg_score"})
    )
    return grp.to_dict("records")


@app.get("/top5/attendance")
def by_attendance():
    return _group_mean(get_df(), "attendance")


@app.get("/top5/hours_studied")
def by_hours():
    return _group_mean(get_df(), "hours_studied")


@app.get("/top5/access_to_resources")
def by_access():
    return _group_mean(get_df(), "access_to_resources")


@app.get("/top5/parental_involvement")
def by_parental():
    return _group_mean(get_df(), "parental_involvement")


@app.get("/top5/tutoring_sessions")
def by_tutoring():
    return _group_mean(get_df(), "tutoring_sessions")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
