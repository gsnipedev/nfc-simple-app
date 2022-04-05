import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import NfcManager, {Ndef, nfcManager, NfcTech} from 'react-native-nfc-manager';
import {useEffect} from 'react/cjs/react.production.min';

// Pre-step, call this before any NFC operations
NfcManager.start();

function App() {
  const [isScanning, setScanStatus] = useState(false);
  const [textTag, setTextTag] = useState('');
  const [isLoading, setLoadingStatus] = useState(false);

  async function readNdef() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      alert('Tag found', tag);
    } catch (ex) {
      console.warn('error');
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
      setScanStatus(false);
    }
  }

  async function writeNdef(text) {
    if (text == '' || isLoading == true) {
      alert('Teks kosong atau tombol write telah di tekan sebelumnya! -_- ');
      setTextTag('');
      return;
    }

    let result = false;

    try {
      setLoadingStatus(true);
      // 1. menentukan request tech NFC yang akan digunakan (e.g NfcA untuk android)
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // 2.Encode teks atau pesan yang akan di simpan ke dalam tag
      // ps: record storage berbentuk Array

      const bytes = Ndef.encodeMessage([Ndef.textRecord(text)]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes); // Menulis record
        result = true;
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest(); // Menghentikan layanan NFC
      setLoadingStatus(false);
    }

    return result;
  }

  async function clearTag() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.ndefHandler.writeNdefMessage(
        Ndef.encodeMessage([Ndef.textRecord('')]),
      );
    } catch (ex) {
      console.log('error');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={readNdef}>
        <Text style={styles.but1}>Scan a Tag</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={clearTag}>
        <Text style={styles.but3}>Clear a Tag</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => writeNdef(textTag)}>
        <Text style={styles.but2}>Write a Tag</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Ketik teks Tag disini"
        onChangeText={typing => setTextTag(typing)}
      />
      <Text>Teks yang akan di input - {textTag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  but1: {
    display: 'flex',
    height: 40,
    width: 300,
    backgroundColor: 'blue',
    textAlign: 'center',
    color: 'white',
    fontSize: 15,

    fontWeight: 'bold',
  },
  but2: {
    height: 40,
    width: 300,
    backgroundColor: 'maroon',
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
  },
  but3: {
    height: 40,
    width: 300,
    backgroundColor: 'maroon',
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    marginVertical: 30,
  },
});

export default App;
