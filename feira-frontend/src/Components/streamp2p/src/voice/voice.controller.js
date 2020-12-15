import RecordRTC, { MediaStreamRecorder, StereoAudioRecorder } from "recordrtc";

let kernel = null;

const receiveVoice = ({ id, data, socket, peersRef }) => {
  const itsMe = id === socket.id;
  if (itsMe) {
    return;
  }
  console.log("---- a ");
  let blob = new Blob([data], { 'type' : 'audio/webm' });
  const audio = new Audio(window.URL.createObjectURL(blob));
  audio.play();
}

export const initStream = async ({
  socket, stream, store, peersRef,
}) => {
  socket.emit('enter_room', {
    room_id: store.state.auth.room,
    name: store.state.auth.name,
    type: store.state.auth.type,
  })

  socket.on('voice', (data) => receiveVoice({ ...data, socket, store, peersRef }));
  socket.on('video', (data) => receiveImage({ ...data, socket, store }));
  const recordAudio = RecordRTC(stream, {
  type: 'audio',
  mimeType: 'audio/webm',
  sampleRate: 44100,
  desiredSampRate: 16000,
  
  recorderType: StereoAudioRecorder,
  numberOfAudioChannels: 1,

  timeSlice: 1000,
  ondataavailable: async (blob) => {
      var buffer = await blob.arrayBuffer();
      socket.emit('audio', {
        room_id: store.state.room.room_id,
        blob: buffer,
        streamer_id: store.state.socket.id,
      });
    }
  });
  recordAudio.startRecording();
}
