import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import { Colors } from '../Styles/Colors';
import useStore from '../../Src/ZustandStore';

const NameUpdateModal = ({ visible, onClose, onSave }) => {

  // Theme
  const { darkTheme } = useStore();
  const styles = createStyles(darkTheme);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [FirstNameTyping, setFirstNameTyping] = useState(false);
  const [LastNameTyping, setLastNameTyping] = useState(false);

  const handleSave = () => {
    if (firstName && lastName) {
      onSave(firstName, lastName);
      onClose();
    } else {
      Alert.alert("Invalid Input", "Please fill in both first and last names.");
    }
  };

  const handleFirstNameTyping = (text) => {
    setFirstName(text);
    setFirstNameTyping(text.length > 0);
  };

  const handleLastNameTyping = (text) => {
    setLastName(text);
    setLastNameTyping(text.length > 0);
  };

  // Cleaner
  useEffect(() => {
    if (visible) {
      setFirstName('');
      setLastName('');
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Update Name</Text>

          <TextInput
            placeholder="First Name"
            placeholderTextColor={darkTheme ? Colors.Grayscale600 : Colors.Grayscale300}
            value={firstName}
            onChangeText={(text) => {
              const filteredText = text.replace(/[ ,:*]/g, '');
              handleFirstNameTyping(filteredText);
            }}
            style={[styles.input, FirstNameTyping && styles.boldText]}
          />

          <TextInput
            placeholder="Last Name"
            placeholderTextColor={darkTheme ? Colors.Grayscale600 : Colors.Grayscale300}
            value={lastName}
            onChangeText={(text) => {
              const filteredText = text.replace(/[ ,:*]/g, '');
              handleLastNameTyping(filteredText);
            }}
            style={[styles.input, LastNameTyping && styles.boldText]}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <View style={{ width: hp(2.6) }} />
            <TouchableOpacity onPress={handleSave} style={styles.saveButton} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (darkTheme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: darkTheme ? 'white' : Colors.Grayscale900,
    padding: hp(2.6),
    borderRadius: hp(1.3),
  },
  modalTitle: {
    fontSize: hp(3.1),
    color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale100,
    fontWeight: '800',
    marginBottom: hp(1.3),
  },
  input: {
    borderBottomWidth: 1,
    borderColor: Colors.Grayscale500,
    padding: hp(1.3),
    marginVertical: hp(1.3),
    width: wp(60),
    fontSize: hp(1.8),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2.6)
  },
  cancelButton: {
    backgroundColor: Colors.Grayscale600,
    height: hp(5.1),
    width: hp(15.4),
    borderRadius: hp(1),
    justifyContent: "center",
    alignItems: "center"

  },
  saveButton: {
    backgroundColor: Colors.Grayscale800,
    height: hp(5.1),
    width: hp(15.4),
    borderRadius: hp(1),
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: hp(1.8),
  },
  boldText: {
    borderBottomWidth: 1,
    borderColor: Colors.Grayscale500,
    padding: hp(1.3),
    marginVertical: hp(1.3),
    width: wp(60),
    color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale100,
    fontWeight: "600",
    fontSize: hp(2.05)
  },
});

export default NameUpdateModal;
