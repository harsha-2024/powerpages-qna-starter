
# Dataverse Schema (How‑to)

Create these tables with the exact logical names to match the Liquid templates.
If you change names, update Liquid accordingly.

## Table: pp_question (Question)
- **pp_title**: Single line of text (Primary field)
- **pp_body**: Multiple lines of text
- **pp_tags**: Single line of text (comma‑separated)
- **pp_vote**: Whole number (Default 0)
- **pp_author**: Lookup to Contact

## Table: pp_answer (Answer)
- **pp_body**: Multiple lines of text
- **pp_vote**: Whole number (Default 0)
- **pp_questionid**: Lookup to **pp_question**
- **pp_author**: Lookup to Contact

## Optional: Tags
- **pp_qtag** with **pp_name** (text), and **pp_question_pp_qtag** many‑to‑many between
  Question and QTag

## Table Permissions
- Create web roles (Authenticated Users, Moderators)
- Grant permissions as described in README

## Sample Data
Use the CSV files in `sample-data/` to import some demo rows.
