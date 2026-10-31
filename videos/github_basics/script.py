# GitHub basics: the script. Simple words (5th grade). One running example: a cookie recipe book.
# line = (who, text, emotion, gap_seconds_before, card_or_None)
# card = dict(k='term'|'do'|'dont'|'chips', t=big text, s=small text, hold=extra seconds)
# who: MICA (teacher robot), YOU (the new learner, human), CHARGEY (teammate robot)
T = lambda t, s, hold=1.2: dict(k='term', t=t, s=s, hold=hold)
DO = lambda s, hold=1.2: dict(k='do', t='DO', s=s, hold=hold)
DONT = lambda s, hold=1.2: dict(k='dont', t="DON'T", s=s, hold=hold)

SCENES = [
 dict(id='intro', step=-1, lines=[
  ('MICA', "Hi! I'm Mica. Today we learn GitHub, one small step at a time.", 'happy', 1.3, T('GitHub made easy', 'no code needed', 2.0)),
  ('YOU', "I only know it stores code. I'm a little lost.", 'worried', 0.4, None),
  ('MICA', "That's okay! We just need five simple words.", 'sweet', 0.35, dict(k='chips', t='5 words', s='', hold=2.2)),
 ]),
 dict(id='what', step=-1, lines=[
  ('MICA', "GitHub is a website. It keeps your project files safe online.", 'happy', 1.2, T('GitHub', 'a safe home for your files')),
  ('YOU', "So it's like Google Drive?", 'happy', 0.35, None),
  ('MICA', "Yes! But it has two extra powers.", 'excited', 0.3, None),
  ('MICA', "Power one. It remembers every change. It's like a time machine.", 'happy', 0.35, T('Power 1', 'a time machine')),
  ('MICA', "Power two. Many people can work on one project without making a mess.", 'happy', 0.35, T('Power 2', 'teamwork')),
 ]),
 dict(id='repo', step=0, lines=[
  ('YOU', "What is a repo?", 'neutral', 1.2, None),
  ('MICA', "Repo is short for repository. It's just a project folder.", 'happy', 0.35, T('REPO', '= a project folder', 1.5)),
  ('MICA', "Say our project is a cookie recipe book. That is one repo.", 'sweet', 0.35, None),
  ('MICA', "Inside are the recipe pages, and the history of every change.", 'happy', 0.35, None),
  ('MICA', "Starting a new project? Make a new repo.", 'excited', 0.4, DO('New project? New repo.')),
  ('MICA', "But do not make a new repo for every tiny change. Just change the files inside.", 'stern', 0.4, DONT('No new repo for each tiny change.')),
 ]),
 dict(id='commit', step=1, lines=[
  ('YOU', "So how does it remember my changes?", 'neutral', 1.2, None),
  ('MICA', "With a commit. A commit is a save point, with a short note.", 'happy', 0.35, T('COMMIT', '= a save point + a note', 1.5)),
  ('MICA', "It's like saving a video game. You can go back to any save.", 'excited', 0.35, None),
  ('MICA', "Commit each time you finish one small thing.", 'happy', 0.4, DO('Save often. One small thing at a time.')),
  ('MICA', "Don't wait a whole week and save everything at once.", 'stern', 0.4, DONT("Don't save it all at the very end.")),
 ]),
 dict(id='branch', step=2, lines=[
  ('MICA', "Every repo has a main branch. Main is the real, finished recipe book.", 'happy', 1.2, T('MAIN', '= the real, finished version', 1.5)),
  ('MICA', "A branch is your own copy lane. Try ideas there, and main stays safe.", 'sweet', 0.35, T('BRANCH', '= your own safe copy lane', 1.5)),
  ('YOU', "I want to add chocolate cookies!", 'excited', 0.35, None),
  ('MICA', "Great! Make a branch. Name it chocolate cookies, and save your work there.", 'happy', 0.35, None),
  ('MICA', "Make a new branch for each new idea or fix.", 'happy', 0.4, DO('One branch for each new idea.')),
  ('MICA', "Don't change main directly when other people use it.", 'stern', 0.4, DONT("Don't edit main directly.")),
 ]),
 dict(id='pr', step=3, lines=[
  ('YOU', "My recipe is done! How do I add it to main?", 'happy', 1.2, None),
  ('MICA', "You ask nicely. That ask is called a pull request.", 'happy', 0.35, T('PULL REQUEST', '= "Please add my work to main"', 1.8)),
  ('MICA', "Your teammates look at your changes. They can leave comments.", 'sweet', 0.35, None),
  ('CHARGEY', "Nice recipe! Please add more chocolate chips.", 'happy', 0.35, None),
  ('YOU', "Good idea! I fixed it.", 'excited', 0.3, None),
  ('MICA', "Open a pull request when your work is ready to be seen.", 'happy', 0.4, DO('Open one when your work is ready.')),
  ('MICA', "Not ready yet? Mark it as a draft. Don't ask for a review too early.", 'stern', 0.4, DONT('Not ready? Mark it "Draft".')),
 ]),
 dict(id='merge', step=4, lines=[
  ('CHARGEY', "All good! I approve it.", 'excited', 1.2, dict(k='term', t='APPROVED', s='your teammate said yes', hold=0.8)),
  ('MICA', "Now you merge. Merge means join your branch into main.", 'happy', 0.35, T('MERGE', '= join your work into main', 1.5)),
  ('MICA', "Click the green Merge button. Your recipe is now in the real book!", 'excited', 0.35, None),
  ('YOU', "Yay! Cookies for everyone!", 'excited', 0.3, None),
  ('MICA', "Merge after someone approves it and the checks look green.", 'happy', 0.4, DO('Wait for a yes and green checks.')),
  ('MICA', "Don't merge if someone asked for changes, or if you see red.", 'stern', 0.4, DONT('No merging when you see red.')),
  ('MICA', "Last step. Delete the branch. It did its job.", 'sweet', 0.4, None),
 ]),
 dict(id='recap', step=5, lines=[
  ('MICA', "Let's say it all together!", 'excited', 1.2, None),
  ('MICA', "A repo is the project folder. A commit is a save point.", 'happy', 0.35, None),
  ('MICA', "A branch is your safe copy lane. A pull request asks for a look.", 'happy', 0.35, None),
  ('MICA', "And merge joins your work into main.", 'happy', 0.35, None),
  ('YOU', "I can do this!", 'excited', 0.35, None),
  ('MICA', "You can! Start with one tiny repo today.", 'sweet', 0.4, T("You've got this!", 'Repo → Commit → Branch → Pull request → Merge', 3.5)),
 ]),
]
VOICE = {  # voice file, pitch, speed (length_scale)
 'MICA': ('en_US-amy-medium', 1.04, 1.07),
 'YOU': ('en_US-kristin-medium', 1.0, 1.02),
 'CHARGEY': ('en_US-ryan-medium', 0.93, 1.02),
}
