# CORRUPTED-WEBSITE

### Current issue

This repo is for debugging the issue happened with my personal blog under Astro (theme Fuwari/Firefly). Known issues as follows:

1. Missing posts by Astro's function getCollection() while building the site (34 specific posts missing consistently, not random, total 100+ posts)
2. No error message shown. Silently returns a subset of posts.

This issue happens **every time** CI runs the workflow, **using cold build**.

### Known but might surfacial solution

Current effective solution (might not be the root cause and might re-appear after making some updates):

1. Change the field 'workers' in config file astro.config.mjs (every type of change is ok: value change, comment out field and so on)

The issue will disappear after you use the solution above, no matter what changes you make to the config file. **To reproduce it you need to re-clone the repo**.

The issue happened before but can be eliminated by dual running `pnpm build`, so I previously doubted that it was a cache issue. **This solution fails to work after I modified one of the posts**.

### Probable ways to issue's root

Probable ways to tackle it listed by Claude:

1. Check CRLF/LF, invisible char, UTF-8 BOM header or special chars hidden in posts, encoding problems (low possibility)
2. Slug collision, date misformat in front-matter (low possibility)
3. SQLite race condition (I didn't find related db file), or concurrent issues
4. File state changed by editor
5. Difference between local env (Windows 64bit) and Github CI (linux)

### My Debug Code 

Debug code is written in file `\src\pages\articles\[...slug].astro`. Outputs a set of missing posts and count.

### Contact me

I'm a senior high student and cannot reply your solutions in time. Only at weekends can I go through you replies and solutions.

Reach me at `justpureh2o@outlook.com` or DM me on Github, posting ISSUE or DISCUSSION in this repo also works.

Either English or Chinese solution is OK.

THANK YOU FOR YOUR SELFLESS HELP!!!
