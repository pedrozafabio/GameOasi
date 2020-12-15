import RecordRTC, { MediaStreamRecorder, StereoAudioRecorder } from "recordrtc";

const receiveVoice = ({ id, data, socket, peersRef }) => {
  const itsMe = id === socket.id;
  if (itsMe) {
    return;
  }
  console.log("-----a");
  let blob = new Blob([data], { 'type' : 'video/webm;codecs=vp9' });
  let video = document.getElementById(id);
  video.src = window.URL.createObjectURL(blob);
  video.play();
}

export const initStream = ({
  socket, stream, room, store, peersRef,
}) => {
  socket.on('voice', (data) => receiveVoice({ ...data, socket, store, peersRef }));
  const recordAudio = RecordRTC(stream, {
  type: 'video',
  mimeType: 'video/mp4;codecs=vp9',
  // sampleRate: 44100,
  // desiredSampRate: 16000,
  
  recorderType: MediaStreamRecorder,
  // numberOfAudioChannels: 1,

  timeSlice: 100,
  ondataavailable: async (blob) => {
      console.log('window.URL.createObjectURL(blob);', window.URL.createObjectURL(blob));
      var buffer = await blob.arrayBuffer();
      socket.emit('audio', { room_id: room.room_id, blob: buffer, streamer_id: socket.id });
    }
  });
  recordAudio.startRecording();
}