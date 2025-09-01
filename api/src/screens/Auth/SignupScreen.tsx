import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constants/theme';

export default function SignupScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();

  const handleSignup = async () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(formData);
      if (!success) {
        Alert.alert('Error', 'Signup failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={theme.gradients.background}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Ionicons name="leaf" size={64} color={theme.colors.accent.gold} />
            <Text style={styles.title}>Join Telemax</Text>
            <Text style={styles.subtitle}>Start your premium pipe journey</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Create Account</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Ionicons name="person-outline" size={20} color={theme.colors.accent.gold} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor={theme.colors.text.muted}
                  value={formData.firstName}
                  onChangeText={(value) => updateForm('firstName', value)}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Ionicons name="person-outline" size={20} color={theme.colors.accent.gold} />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor={theme.colors.text.muted}
                  value={formData.lastName}
                  onChangeText={(value) => updateForm('lastName', value)}
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.accent.gold} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.text.muted}
                value={formData.email}
                onChangeText={(value) => updateForm('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.accent.gold} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.colors.text.muted}
                value={formData.password}
                onChangeText={(value) => updateForm('password', value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={theme.colors.text.muted} 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.accent.gold} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={theme.colors.text.muted}
                value={formData.confirmPassword}
                onChangeText={(value) => updateForm('confirmPassword', value)}
                secureTextEntry={!showPassword}
              />
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <LinearGradient
                colors={theme.gradients.primary}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkAccent}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.accent.gold,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  halfWidth: {
    width: '48%',
  },
  input: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.primary,
    fontSize: 16,
  },
  signupButton: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.background.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    color: theme.colors.text.muted,
    fontSize: 14,
  },
  linkAccent: {
    color: theme.colors.accent.gold,
    fontWeight: 'bold',
  },
});
