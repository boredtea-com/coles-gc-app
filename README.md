

# Coles Gift Card App

This react native app allows you to easily manage your Coles gift cards. 

Currently the roadmap is to support Android only as I do not have any IOS devices.

## Todo list:
- [ ] Unit tests
- [ ] Able to support sorting cards
- [ ] Able to re-arrange cards
- [X] Support for flybuys (EAN13 barcode, different colours, at top of list)
- [ ] Better about page
- [x] Ability to change theme
- [x] Change theme based on device theme
- [ ] Backups of DB periodically
- [ ] Backup and restore database
- [x] Auto increase brightness for card barcode

 
## Commands:
- `npx expo run:android`: Command to run the app on your android device
- `eas build -p android --local --profile preview`: Command to build android locally using preview profile
- `eas build -p android`: Command to build using eas for android
- `npx expo run`: Command to run the app on expo go


## Requirements

As this is an expo app using SDK 50 we need a few things to run and build this app. 

Please follow the following guide on expo.dev website: 


