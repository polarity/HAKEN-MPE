loadAPI(1)

host.defineController('Haken', 'Haken Board', '1.0', '8a064e50-b330-11e6-9598-0800200c9a66')
host.defineMidiPorts(1, 1)

function init() {
  host.getMidiInPort(0).setMidiCallback(onMidi)
  noteInput = host.getMidiInPort(0).createNoteInput('',
    '8?????',
    '9?????',
    'B?40??',
    'B?4A??',
    'C?????',
    'D?????',
    'E?????')

  noteInput.setUseExpressiveMidi(true, 0, 48)

  var bendRanges = ['12', '24', '36', '48', '60', '72', '84', '96']
  bendRange = host.getPreferences().getEnumSetting('Bend Range', 'MIDI', bendRanges, '48')
  bendRange.addValueObserver(function (range) {
    var pb = parseInt(range)
    noteInput.setUseExpressiveMidi(true, 0, pb)
    sendPitchBendRangeRPN(1, pb)
  })

  // Set POLY ON mode with 8 MPE voices
  sendChannelController(0, 127, 8)

  // Set up pitch bend sensitivity to 48 semitones
  sendPitchBendRangeRPN(1, 48)

  device = host.createEditorCursorDevice()
}

function sendPitchBendRangeRPN(channel, range) {
  sendChannelController(channel, 100, 0); // Registered Parameter Number (RPN) - LSB*
  sendChannelController(channel, 101, 0); // Registered Parameter Number (RPN) - MSB*
  sendChannelController(channel, 36, 0)
  sendChannelController(channel, 6, range)
}

function onMidi(status, data1, data2) {
  // printMidi(status, data1, data2)
  noteInput.sendRawMidiEvent(status, data1, data2)  
}

function exit() {
}
