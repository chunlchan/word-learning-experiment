# Word Learning Experiment

## Introduction
Word learning web experiment
- Presents images and sound files to a participant. Experiment divided into four sets of training and test blocks to a participant

### Training block
- A a singleimage is presented and a wav file plays
- Participant presses spacebar to proceed through all items
- Items presented to participant are listed in the test_block.json file in /public/lists

### Test block
- Participant is presented with two images for a brief period followed by red square
- Participant presses the spacebar to hear the accompanying wav file
- Participant responds by pressing either "z" (left picture) or "m" (right picture) on the keyboard 
- Items presented to participant are listed in the training_block.json file in /public/lists

## Setup
- Download or clone repo.
- Run npm install
```
npm install
```
- Get firebase [config file](https://firebase.google.com/docs/web/setup#add-sdks-initialize) and save as firebase.config.json in /public folder.
- See /public/firebase.config.demo.json for an example of what the config file should look like.
- Firebase RealTime database must be active and with the active json lists declared under master/blocks/
- ![rtdb_master](docs/rtdb_master.png)

## Development
```
npm run serve
```

### Production
```
npm run build
```


