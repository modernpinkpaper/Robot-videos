VOICE = {
 'MICA':    ('en_US-amy-medium', 1.04, 1.0),
 'HOOKY':   ('en_GB-alba-medium', 1.06, 1.0),
 'CHARGEY': ('en_US-ryan-medium', 0.93, 1.0),
 'DRAFTY':  ('en_US-kristin-medium', 1.05, 1.0),
 'LISTER':  ('en_US-joe-medium', 1.08, 0.95),
 'LOGBOT':  ('en_US-lessac-medium', 0.86, 1.0),
 'LEFTY':   ('en_US-joe-medium', 1.08, 0.95),
 'KRAFT':   ('en_US-ryan-medium', 0.92, 1.0),
 'DUSTY':   ('en_US-lessac-medium', 0.84, 1.18),
 'DYMO':    ('en_US-hfc_female-medium', 1.14, 1.0),
 'STATUS':  ('en_GB-alba-medium', 0.95, 1.05),
 'DALIA':   ('en_US-ljspeech-medium', 1.0, 0.97),
}
NAMES = {'MICA':'Mica','HOOKY':'Hooky','CHARGEY':'Chargey','DRAFTY':'Drafty','LISTER':'Lister','LOGBOT':'Logbot','LEFTY':'Lefty','KRAFT':'Kraft','DUSTY':'Dusty','DYMO':'Dymo','STATUS':'Status','DALIA':'Dalia'}

# ---- Human characters (characters/robots.js PEOPLE). Same format: (piper voice, pitch, speed). Added so any video can use them.
VOICE.update({
 'AMINA':    ('en_US-kristin-medium', 0.98, 1.0),
 'MARCUS':   ('en_US-ryan-medium', 0.88, 1.02),
 'LILY':     ('en_US-amy-medium', 1.14, 0.97),
 'SOFIA':    ('en_US-hfc_female-medium', 1.0, 1.0),
 'GRANDPA':  ('en_US-lessac-medium', 0.80, 1.12),
 'KID_BOY':  ('en_US-joe-medium', 1.38, 0.95),
 'KID_GIRL': ('en_GB-alba-medium', 1.25, 0.95),
 'NARRATOR': ('en_US-lessac-medium', 0.96, 1.0),
})
NAMES.update({'AMINA': 'Amina', 'MARCUS': 'Marcus', 'LILY': 'Lily', 'SOFIA': 'Sofia', 'GRANDPA': 'Grandpa', 'KID_BOY': 'Sam', 'KID_GIRL': 'Zoe', 'NARRATOR': 'Narrator'})

# ---- Emotional Robots characters: Piper fallback (used only if Chatterbox is not set up). Real voices: voices/human_tts.py
VOICE.update({
 'MARA':  ('en_US-hfc_female-medium', 0.98, 1.0), 'THEO': ('en_US-ryan-medium', 0.90, 1.0), 'PRIYA': ('en_US-amy-medium', 1.10, 0.97),
 'JUNE':  ('en_US-kristin-medium', 0.90, 1.08),   'KAI':  ('en_US-joe-medium', 1.35, 0.95),  'GUS':   ('en_US-lessac-medium', 0.80, 1.12),
 'ZOE':   ('en_US-amy-medium', 1.22, 0.97),       'FINN': ('en_US-ryan-medium', 1.08, 1.0), 'HANA':  ('en_US-hfc_female-medium', 1.06, 1.0),
 'NINA':  ('en_GB-alba-medium', 1.25, 0.95),
})
NAMES.update({k: k.capitalize() for k in ['MARA', 'THEO', 'PRIYA', 'JUNE', 'KAI', 'GUS', 'ZOE', 'FINN', 'HANA', 'NINA']})
