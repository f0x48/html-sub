# html-sub
html-sub is telegram bot that message you when webpage that you requested this bot to watch is updated.
Of course it's not gonna compare all the html string.

# Getting started
What you need to start watch the webpage is
1. Search GET URL (for example) that has been sorted to newest so the changes always appear in the first page.
2. The document selector. This bot use `document.querySelectorAll` so it can monitor changes in the element list

### Chat with the bot
Just message `@HtmlSubBot` on telegram

# Use cases
1. Check Torrent website for update

# Running your own bot
Create file called `token.txt` and insert your telegram bot token  
Run the nodejs program with command `npm start`



