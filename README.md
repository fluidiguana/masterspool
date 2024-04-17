# TheMastersPool
Code repo for my masters pool website. Update Instructions from 2024 tournament:

--- Initiatlize Tournament ---
Look up tournament key on RapidAPI
run initialize_tournament.js

--- Create Player Groupings ---
export Players_v2 from PGAdmin
Find latest masters odds
Append odds data to player participants
Create Groupings (2A, 2B, 2C, 2D, 1E, 1F), copy back non-english letters into excel, save as .csv
Truncate Players_v2 from PGAdmin, upload groupings back in

--- Update Entry Form ---
Copy google form, clear players from groupings
Copy/Paste names in group chunks from CSV into Google Forms (import works perfectly)
Update any other required fields in the Form

-- Collect Team Inputs --
Send and wait

-- Update leaderboard --
Truncate Teams from PGAdmin
Fix player responses to Teams table format
Upload .csv into Teams to create live teams

-- Create leaderboard JSON --
Run leaderboard_JSON_writer.js
Replace resultant file in fluidiguana/masterspool
Leaderboard will load to public in 10-15s
