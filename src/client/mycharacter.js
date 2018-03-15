import MapleCharacter from './maplecharacter';

const MyCharacter = new MapleCharacter({
  name: 'Admin',
});

MyCharacter.level = 9;
MyCharacter.hp = 30000;
MyCharacter.maxHp = 30000;
MyCharacter.mp = 30000;
MyCharacter.maxMp = 30000;

export default MyCharacter;
