<center>

<p align="center">

<img align="center" height="100px" alt="icon" src="https://kl13nt.github.io/ally-reads/img/icon.png">

# Ally Reads!

</p>

</center>

An accessibility suite giving you control over what you read.

<center>

<p align="center">

<img align="center" alt="screenshot" height="400px" src="https://kl13nt.github.io/ally-reads/img/screenshot.PNG">

</p>

</center>

## Table of Contents
- [Developer Notes](#Developer-Notes)
- [Motivation](#Motivation)
- [How to use](#How-to-use)
- [Contributing](#Contributing)
- [Lifecycle](#Lifecycle)
- [Upcoming Features](#Upcoming-Features)
- [Testing](#Testing)
- [Known Bugs](#Known-Bugs)
- [FAQ](#FAQ)
- [Change Log](#Change-Log)
- [License](#License)

## Developer Notes
Hello there! Reading this means you're interested in the source code for this extension, and lucky you, it's actually completely *open source*.

I'm Nabil Tharwat, a UXE based in Egypt. Feel free to contact me about anything and everything related to this codebase. If you want to request a feature, shoot me an issue on this repo or contact me on any platform. Wondering where to find me? Head to [iamnabil](https://iamnabil.me/about) and pick the platform you'd like. I'll let you read the documentation now. Have a lovely day!

There's a DevLog/Timelapse video for the creation of this. It took me 1-2 full days. Find it here: <a href="">[Ally Reads! - Extension Development Devlog/Timelapse [Arabic]](https://www.youtube.com/watch?v=OeVvVMPCdbY)

> Currently Firefox only is supported

## Motivation
You're probably wondering: why would anyone make this? The motivation for this was a tweet back in 2019 (I'm still searching for it) and it was about the struggle of people with disabilities and difficulties reading long blocks of text, especially when they're non-technical people. I had a brief discussion with the OP and turns out that no solution for this exists yet? So I decided to implement it myself. But yes, that was in 2019 and I couldn't get around to actually doing it but until now.

## How to use
You can install it from the official extension stores or from its website. After installing you go to extension settings and configure it to your liking. There's a sample preview text for you to preview your changes. You can then rest assured it'll work on all paragraphs on all websites.

## Contributing
I love contributing to OSS! And would love contributions to this repo. If you have a feature request, bug report, or have coded a new feature you can open an issue/PR/contact me anywhere and tell me all about it. If you have suggestions regarding cleaning up this codebase also feel free to tell me. I'd love to hear others' opinions on this.


## Lifecycle
Commits follow a schema that's defined as `[<type>] <commit_message>`, where `<type>` is one of:
- `Bug`: Bug fixes and commits related to them
- `Feature`: Feature updates and incremental additions
- `Docs`: Documentation updates
- `Config`: Configuration changes
- `Amend`: Fixing older commits and/or rebasing them

All commits are on `develop` branch by default and new releases are then PR'ed into `master` which in turn starts the CI stages:
1. `lint`
2. `test`
3. if both previous passed, `build`
4. if `build` passed, generate new `docs`
5. deploy to gh-pages branch

> You're well advised to make sure tests and linting pass on your machine locally before pushing.

I use TravisCI and the configuration is based on some important env variables:
- `API_KEY`: Mozilla addon api key
- `API_SECRET`: Mozilla addon api secret
- `GITHUB_ACCESS_TOKEN`: Access token for GitHub account to enable Travis to push and control the flow of the repo.

> Starting with v1.0.6, the repo is using semver for versioning as well as the rules introduced earlier regarding commit messages.

## Upcoming Features
- **Format any element**: In this, you will be able to format any element as easy as clicking your mouse.

- **Smarter word breaks**: You may notice that sometimes the end of sentences come on a new line instead of completing the current one, and other spacing-related bugs. These are caused by the way the extension handles words and spacing. Will be fixing it soon.

- **Font selection list**: To allow you to select a font for all paragraphs on all websites, or maybe even all elements. But to preserve the look and feel of websites there would be an option for the user to specify which behaviour they want.

- **Text foreground & background colour selection**: Colour what you read.

- **Instant word definitions**: Click a word and get definitions for it right away!

- **Change settings on the fly**: Allows you to change extension settings without going to addon-settings.

## Testing
~~Unit Testing WebExtensions is such a pain that I decided not to cover the whole extension. I have written unit tests for critical logic. Before testing make sure to uncomment the export line in `content_script.js`.~~

Testing is now possible and easy since I introduced Webpack to the codebase. It now handles building parallel to web-ext where Webpack bundles the JS modules needed and stores them in `dist/` and web-ext hot-loads the extension and all needed config.

## Known Bugs
- **Social media and text modifications** *#004* *Fixed*: Text modifications such as writing a facebook post or a tweet will cause the extension to query the DOM on every few key strokes. This is because of the behaviour of the MutationObserver API. A possible fix for it could be to detect keyboard events and/or check the type of element the user is updating (i.e. text area, input field, etc.)

- **Broken links** *#003* *Fixed*: The extension uses a very basic approach to replace `<p>` tags textContent. This causes any inner elements to be broken down and replaced with only the string value of textContent. I'll be looking into this and will probably replace it with something more advanced like an HTML parses for instance. This will allow me to differ between nested elements and modify text nodes only.

## FAQ
Q. Is the extension free to use?

	Yes. The extension is open-source and free to use. No hidden fees. I will not ask you to pay for anything.

Q. What browsers is this available for?

	Firefox is the only browser supported as of now. There are currently no plans to port it to any Chromium-based browser.

Q. How can I report bugs?

	If you're a developer and you know how to use GitHub issues, feel free to open a new issue on the repo. If you're not familiar with GitHub you can contact me personally. Contact info can be found at https://iamnabil.me

Q. Can I submit PR's any time?

	I'd appreciate it if you open a PR after discussing the changes you'll be making in an issue first. This way you won't waste your time working on something that may not be needed or that may be in development.

## Change Log

- **v1.0.6**
	- Fixed bug #004 user-intiated mutations
	- Fixed a bug where changing checkbox values in settings didn't reflect
	- Fixed a scanning bug where the extension re-formatted the already formatted elements

- **v1.0.5**
	- Bug fixes and improved testing

- **v1.0.3**
	- Bug fixes:

		- Broken Links#003 Replaced the logic by modifying only textNodes inside of each p node.

- **v1.0.2**
	- Implemented unit tests
	- Bug fixes

- **v1.0.1**
	- Bug fixes:

		- Navigation#001
		- Deferring Algorithm#002

	- Improved Detection & Collision Algorithms: The current algorithm is slow in detecting changes to the DOM and reacting to it. And it also lacks safety from collision caused by *separate* mutations.

- **v1.0.0**
	- Initial Release

## Licence
This repo is licensed under the GNU GENERAL PUBLIC LICENSE v3. This means you can use it commercially and privately, redistribute, and modify all while using the same licence and after stating the changes you made, as well as disclosing the source, which is this repo, or me personally. This licence doesn't guarantee liability or warranty of any kind. Use at will.

Find the full licence [here](../license)