# Content Script
This is the documentation for the extension's content script. The extension works by loading configuration objects from the [extension local storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage) and passing those config objects to the `DOMManipulator` class which has a few utility methods modeled like `React`.

## Table of Contents
	- [DOMManipulator](#DOMManipulator)
		- [Properties](#DOMManipulator_Properties)
		- [shouldUpdate](#shouldUpdate)
		- [updateState](#updateState)
		- [formatText](#formatText)
		- [reformatDOM](#reformatDOM)
		- [scanDOM](#scanDOM)
		- [setState](#setState)
	- [OptionsSchema](#OptionsSchema)
		- [Properties](#OptionsSchema_Properties)
		- [verifySchema](#verifySchema)

## DOMManipulator
The class responsible for scanning, formatting, tracking, and updating the DOM. All its actions and modifications are based on the `ExtensionSettings` object stored in `Extension Local Storage`.

