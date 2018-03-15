/**
 * Plays audio.
 *
 * This function allows an audio object to be played concurrently, i.e.
 * it is not necessary for an audio object to finish playing before it can
 * be played again.
 *
 * @param {Audio} audio - The audio object.
 * @param {float} [volume=1] - Loudness of audio.
 */
function PLAY_AUDIO(audio, volume=1) {
  const concurrentAudio = audio.cloneNode();
  concurrentAudio.volume = volume;
  concurrentAudio.play();
}

export default PLAY_AUDIO;
