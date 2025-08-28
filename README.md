# Animus

## A fitness tracking app

This project was made with Vite, React, Javascript, d3, SASS, bCrypt, supabase, and some other small plugins like progressbar.js 

Submitted as a personal project to boot.dev

## Login

Make your own account or log in with:

Name: Guest
Password: password1

## Challenges

1. Creating a timer with an accurate one-second-per-second pace was tricky, as was synchronising the progress bar with the timer accurately. This challenge extended to making a functional interval/rest system. I think I've achieved a good result with this, plus it links with the profile to track training time and number of sessions.
2. Using supabase and bcrypt was a good choice, but hooking it up to the app in a sensible way was tricky. I'm not especially happy with the login system, but it's functional.
3. Learning d3 for the data visualization was good fun and an interesting challenge! I like how it's turned out, though it was unexpectedly challenging thinking up the most appropriate ways to display the data for each category.

## To-Do

- Add more fitness tracking categories
- Better username and password protection (min length, special characters, etc)
- Better integration of workouts with timer
- Better designed profile page
- Add calendar to track and schedule workout and rest days

## Bugs

- App doesn't keep phones and tablets awake, requiring screen taps. The animated logo fixes this in some cases, and I couldn't make keepawake work properly.
- Audio in the timer can bug out on some machines and in some browsers, need a workaround to disable audio if this is the case.
