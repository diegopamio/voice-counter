VOICE COUNTER
==============

An ionic app to aid counting different things when you have your hands unavailable

Demo
----

[![Demo Video](http://img.youtube.com/vi/_9a_9q3_SLA/0.jpg)](http://www.youtube.com/watch?v=_9a_9q3_SLA "Voice Counter Demo")

Context
-------
I've made this app to:

1. Help my wife in his profession (biochemist).
2. Eventually get some revenue after publishing the app in the stores.
3. As a showcase of my knowledge on Ionic and hybrid apps, as the only other things I've made cannot be shared/shown.
4. Practice and experiment with some JavaScript concepts.

Integrated components
---------------------
* ngStorage for seamless local storage integration.
* angular-translate for i18n
* MomentJS for nicer date format, synced with angular-translate for locale.
* annyang for speech recognition, with language synced with settings (translation and time/date i18n).

Used ionic/cordoba features
-------------------
* Ionic Modal Dialogs
* Keyboard Plugin
* CrosWalk to enable speech recognition in older Android devices and improve preformance
* cordoba-plugin-globalization to auto-detect device language.
* $cordovaDialogs

Some quirks and experiments
---------------------------
* upgraded to angular 1.6
* a localStorage Entity Manager "library" from scratch (< 50 LoC)
* No Styles, No Clases: I was able to do the entire app without defining a single css class, only using the standards and classes provided by ionic.
