# Overlay

## Usage

### entry.js (or any file used as an entry file with browserify)
```javascript

// require in plugin on entry file
require('overlay')($);

$(function () {

	// initialize the overlay trigger
	$('.overlay-trigger').overlayModal();

});
```

### example trigger markup
```html

	<p class="overlay-trigger">Overlay Trigger</p>

```


## Default settings
```javascript
"overlayAppendSelector":".base",
"overlayClassname": "overlay",
"overlayContainerClassname":"overlay-container",
"overlayBodyClassname":"overlay-body",
"activeClassname":"overlay-active",
"closeClassname":"overlay-close",
"interstitial": false,
"interstitialSelector":".interstitial-link",
"interstitialCancel":".interstitial-cancel",
"interstitialPopupSelector": "#third-party-overlay",
"overlayAuxiliaryClass": null,
"plugins":{},
"onOpen": function () {},
"onClose": function () {}
```

## Settings Reference

### {overlayAuxiliaryClass:`string`}
Add an extra class to the overlay body for custom styling. 


### {plugins:`object`}
Mechanist for extending logic. See example below for the email a friend overlay:
```
('.email-friend-trigger').overlayModal({
    plugins:{
        emailFriend:require('overlay-email-friend')
    }
});
``` 

