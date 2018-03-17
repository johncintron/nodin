# Nodin

## Getting set up
* Clone https://github.com/johncintron/wz_client into `client/wz_client`.
* `npm install`
* `npm run local` to start the application with inspectable client code.
* `npm run dev` to start the application with minified IIFE client code.


## Ragezone Post

* Hi all,

* After futzing around with the physics, I've come to realize that replicating the physics from the original client will be a much harder task than I anticipated. As such, I will have to slow down development and take time to do research and reverse engineer (as best as possible) the physics. You won't see many updates in the near future, but I assure you all that I am still actively working on this project.

* Additionally, because I spent a lot of time working on the client, I acknowledge that some very important things are lacking: documentation and unit tests. These will be added soon.

* In lieu of updates, I am opening up the project for anyone to clone and play around with. See it here: https://github.com/johncintron/nodin.

* Edit: Answers to what I suspect will be FAQs:

* How do I get past the login screen?
* Go in the developer console and enter: LoginState.enterGame(); You can also move up the login map by mutating the Camera.y attribute.

* How do I switch maps?
* MapleMap.load(id); where id is the map id you want to load.

* How do I attach equips to the character?
* MyCharacter.attachEquip(slot, id); where slot is the equip slot and id is the equip id.

* How do I spawn another player?
* MapleCharacter.fromOpts(obj).then(m => MapleMap.characters.push(m));

* Why no WebGL?
* I ditched Phaser because it was too heavy and some MapleStory-specific things were hard to implement using Phaser. Implementing the rendering engine in WebGL would have taken me forever and the game as it stands today runs at 60 FPS on Firefox and Chrome with an i7 processor.

* If anyone wishes to contribute, feel free to PM me and I will add you as a collaborator. I welcome all pull requests!