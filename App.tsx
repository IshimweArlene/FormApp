import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';

interface FormData {
  // Text inputs
  text: string;
  password: string;
  email: string;
  number: string;
  tel: string;
  url: string;
  search: string;
  
  // Date and time
  date: Date;
  time: Date;
  datetime: Date;
  
  // Selection
  checkbox1: boolean;
  checkbox2: boolean;
  radio: string;
  dropdown: string;
  multiSelect: string[];
  
  // Range and color
  slider: number;
  color: string;
  
  // Files
  file: any;
  image: string | null;
  
  // Other
  hidden: string;
  textarea: string;
  switch: boolean;
  
  // Personal info
  firstName: string;
  lastName: string;
  age: string;
  address: string;
  city: string;
  zipCode: string;
}

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    text: '',
    password: '',
    email: '',
    number: '',
    tel: '',
    url: '',
    search: '',
    date: new Date(),
    time: new Date(),
    datetime: new Date(),
    checkbox1: false,
    checkbox2: false,
    radio: 'option1',
    dropdown: 'option1',
    multiSelect: [],
    slider: 50,
    color: '#3498db',
    file: null,
    image: null,
    hidden: 'hidden_value',
    textarea: '',
    switch: false,
    firstName: '',
    lastName: '',
    age: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.tel && !validatePhone(formData.tel)) {
      newErrors.tel = 'Invalid phone number';
    }

    if (formData.url && !validateURL(formData.url)) {
      newErrors.url = 'Invalid URL format';
    }

    if (formData.number && (isNaN(Number(formData.number)) || Number(formData.number) < 0)) {
      newErrors.number = 'Must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const takePicture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      setFormData({ ...formData, file: result.assets[0] });
    }
  };

  const toggleMultiSelect = (value: string) => {
    const currentSelection = [...formData.multiSelect];
    const index = currentSelection.indexOf(value);
    
    if (index > -1) {
      currentSelection.splice(index, 1);
    } else {
      currentSelection.push(value);
    }
    
    setFormData({ ...formData, multiSelect: currentSelection });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form Submitted:', {
        ...formData,
        image: formData.image ? 'Image selected' : 'No image',
        file: formData.file ? formData.file.name : 'No file',
      });
      
      Alert.alert('Success', 'Form submitted successfully!');
      setIsSubmitting(false);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      text: '',
      password: '',
      email: '',
      number: '',
      tel: '',
      url: '',
      search: '',
      date: new Date(),
      time: new Date(),
      datetime: new Date(),
      checkbox1: false,
      checkbox2: false,
      radio: 'option1',
      dropdown: 'option1',
      multiSelect: [],
      slider: 50,
      color: '#3498db',
      file: null,
      image: null,
      hidden: 'hidden_value',
      textarea: '',
      switch: false,
      firstName: '',
      lastName: '',
      age: '',
      address: '',
      city: '',
      zipCode: '',
    });
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Comprehensive Form</Text>
          <Text style={styles.subtitle}>All React Native Form Elements</Text>

          {/* SECTION: Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Personal Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={[styles.input, errors.firstName && styles.inputError]}
                placeholder="Enter first name"
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                autoCapitalize="words"
              />
              {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Age (Number Input)</Text>
              <TextInput
                style={[styles.input, errors.number && styles.inputError]}
                placeholder="Enter age"
                keyboardType="numeric"
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
              />
            </View>
          </View>

          {/* SECTION: Text Input Types */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Text Input Types</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Enter password"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone (Tel Input)</Text>
              <TextInput
                style={[styles.input, errors.tel && styles.inputError]}
                placeholder="1234567890"
                keyboardType="phone-pad"
                value={formData.tel}
                onChangeText={(text) => setFormData({ ...formData, tel: text })}
              />
              {errors.tel && <Text style={styles.errorText}>{errors.tel}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Website (URL Input)</Text>
              <TextInput
                style={[styles.input, errors.url && styles.inputError]}
                placeholder="https://example.com"
                keyboardType="url"
                autoCapitalize="none"
                value={formData.url}
                onChangeText={(text) => setFormData({ ...formData, url: text })}
              />
              {errors.url && <Text style={styles.errorText}>{errors.url}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Search</Text>
              <TextInput
                style={styles.input}
                placeholder="Search..."
                value={formData.search}
                onChangeText={(text) => setFormData({ ...formData, search: text })}
                clearButtonMode="while-editing"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Number Input</Text>
              <TextInput
                style={[styles.input, errors.number && styles.inputError]}
                placeholder="Enter a number"
                keyboardType="numeric"
                value={formData.number}
                onChangeText={(text) => setFormData({ ...formData, number: text })}
              />
              {errors.number && <Text style={styles.errorText}>{errors.number}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Textarea (Multiline)</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                placeholder="Enter multiple lines..."
                multiline
                numberOfLines={4}
                value={formData.textarea}
                onChangeText={(text) => setFormData({ ...formData, textarea: text })}
                maxLength={500}
              />
              <Text style={styles.helperText}>{formData.textarea.length}/500 characters</Text>
            </View>
          </View>

          {/* SECTION: Date and Time */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Date and Time Pickers</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{formData.date.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.date}
                  mode="date"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setFormData({ ...formData, date: selectedDate });
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text>{formData.time.toLocaleTimeString()}</Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={formData.time}
                  mode="time"
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime) {
                      setFormData({ ...formData, time: selectedTime });
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date and Time</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDateTimePicker(true)}
              >
                <Text>{formData.datetime.toLocaleString()}</Text>
              </TouchableOpacity>
              {showDateTimePicker && (
                <DateTimePicker
                  value={formData.datetime}
                  mode="datetime"
                  onChange={(event, selectedDateTime) => {
                    setShowDateTimePicker(false);
                    if (selectedDateTime) {
                      setFormData({ ...formData, datetime: selectedDateTime });
                    }
                  }}
                />
              )}
            </View>
          </View>

          {/* SECTION: Selection Controls */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Selection Controls</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Checkboxes</Text>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={formData.checkbox1}
                  onValueChange={(value) => setFormData({ ...formData, checkbox1: value })}
                  color={formData.checkbox1 ? '#007AFF' : undefined}
                />
                <Text style={styles.checkboxLabel}>Option 1</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={formData.checkbox2}
                  onValueChange={(value) => setFormData({ ...formData, checkbox2: value })}
                  color={formData.checkbox2 ? '#007AFF' : undefined}
                />
                <Text style={styles.checkboxLabel}>Option 2</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Radio Buttons</Text>
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setFormData({ ...formData, radio: 'option1' })}
              >
                <View style={styles.radioOuter}>
                  {formData.radio === 'option1' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Radio Option 1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setFormData({ ...formData, radio: 'option2' })}
              >
                <View style={styles.radioOuter}>
                  {formData.radio === 'option2' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Radio Option 2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setFormData({ ...formData, radio: 'option3' })}
              >
                <View style={styles.radioOuter}>
                  {formData.radio === 'option3' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Radio Option 3</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Dropdown (Select/Picker)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.dropdown}
                  onValueChange={(value) => setFormData({ ...formData, dropdown: value })}
                >
                  <Picker.Item label="Select an option" value="" />
                  <Picker.Item label="Option 1" value="option1" />
                  <Picker.Item label="Option 2" value="option2" />
                  <Picker.Item label="Option 3" value="option3" />
                  <Picker.Item label="Option 4" value="option4" />
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Multi-Select</Text>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={formData.multiSelect.includes('item1')}
                  onValueChange={() => toggleMultiSelect('item1')}
                  color={formData.multiSelect.includes('item1') ? '#007AFF' : undefined}
                />
                <Text style={styles.checkboxLabel}>Item 1</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={formData.multiSelect.includes('item2')}
                  onValueChange={() => toggleMultiSelect('item2')}
                  color={formData.multiSelect.includes('item2') ? '#007AFF' : undefined}
                />
                <Text style={styles.checkboxLabel}>Item 2</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={formData.multiSelect.includes('item3')}
                  onValueChange={() => toggleMultiSelect('item3')}
                  color={formData.multiSelect.includes('item3') ? '#007AFF' : undefined}
                />
                <Text style={styles.checkboxLabel}>Item 3</Text>
              </View>
              <Text style={styles.helperText}>
                Selected: {formData.multiSelect.length > 0 ? formData.multiSelect.join(', ') : 'None'}
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Switch (Toggle)</Text>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Enable notifications</Text>
                <Switch
                  value={formData.switch}
                  onValueChange={(value) => setFormData({ ...formData, switch: value })}
                />
              </View>
            </View>
          </View>

          {/* SECTION: Range and Color */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Range and Color</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Range Slider: {Math.round(formData.slider)}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={formData.slider}
                onValueChange={(value) => setFormData({ ...formData, slider: value })}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#ddd"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Color Picker</Text>
              <View style={styles.colorRow}>
                {['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'].map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      formData.color === color && styles.colorSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, color })}
                  />
                ))}
              </View>
              <Text style={styles.helperText}>Selected: {formData.color}</Text>
            </View>
          </View>

          {/* SECTION: File and Image */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>File and Image Uploads</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Image Picker</Text>
              {formData.image && (
                <Image source={{ uri: formData.image }} style={styles.imagePreview} />
              )}
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.secondaryButton} onPress={pickImageFromGallery}>
                  <Text style={styles.secondaryButtonText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={takePicture}>
                  <Text style={styles.secondaryButtonText}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Document/File Picker</Text>
              {formData.file && (
                <Text style={styles.fileName}>Selected: {formData.file.name}</Text>
              )}
              <TouchableOpacity style={styles.secondaryButton} onPress={pickDocument}>
                <Text style={styles.secondaryButtonText}>Pick Document</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* SECTION: Address */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Address Information</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={styles.input}
                placeholder="123 Main St"
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City name"
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Zip Code</Text>
              <TextInput
                style={styles.input}
                placeholder="12345"
                keyboardType="numeric"
                value={formData.zipCode}
                onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
              />
            </View>
          </View>

          {/* Hidden Input (concept demonstration) */}
          <Text style={styles.helperText}>Hidden value stored: {formData.hidden}</Text>

          {/* SECTION: Form Actions */}
          <View style={styles.actionButtons}>
            {isSubmitting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Submitting...</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>Submit Form</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
                  <Text style={styles.resetButtonText}>Reset Form</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              * Required fields
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingBottom: 5,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  dateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: '#333',
    borderWidth: 3,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  fileName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    backgroundColor: '#5AC8FA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  resetButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});
