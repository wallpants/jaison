# Audio Processing Flow

1. Insert _transcript_ entry to database. TRANSCRIPT_STATUS = "waiting"
2. File upload to `{userId}/{transcriptId}.{fileExtension}`
3. File upload triggers webhook that submits _transcript_ to revai.
   TRANSCRIPT_STATUS = "started"
4. Revai hits our endpoint when done. TRANSCRIPT_STATUS = "completed" | "failed"
5. If completed we query for _extractor_jobs_ that depend on that _transcript_
   & submit prompts
