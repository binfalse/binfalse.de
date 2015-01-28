---
name: RD
link: ''
date: '2011-09-30 07:54:40'
comment: "Some other small things I noticed while playing with the extension (btw: I am using v1.2, bumped for Fx7):\n\n• The extension should handle the case when the keyword already exists. You can test that easily if you set a specific keyword twice for different pages. On the second attempt the extension's response is \"The API returned crap\". Better would be a hint of duplication and the chance to enter an alternative keyword (and all of this silently if the option to enter the keyword manually is not set).\n\n• While everything is configured and works correctly the button \"test configuration\" in the options returns \"undefined\", \"4\" and shortens afterwards. A test shouldn't really write to the database but just check if the settings make sense and work. What does \"undefined\" and \"4\" mean?\n\n• If the option to enter the keyword manually is set it takes the keyword when entered and generates randomly when nothing is entered. But what is the Cancel button for? It seems to do the same thing as just entering nothing. Maybe it would be a good idea to give the user the option to cancel the keyword generation that way, so that hitting \"Cancel\" just closes all dialogues and doesn't create a DB-entry.\n\nJust thoughts. :-) Love your extension, makes using YOURLS so much easier."
post_id: /software/browser-extensions/yourls-firefox-extension

---


