import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@repo/app';
import { Card } from '@repo/ui';
import { useLoading } from '../../contexts/LoadingContext';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const { startLoading, stopLoading } = useLoading();

  const handleSubmit = async () => {
    startLoading();

    try {
      const result = await signInWithEmailAndPassword(email, password);

      if (result) {
        console.log('Login successful');
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      stopLoading();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 items-center justify-center bg-background p-6">
          <Card className="w-full max-w-md p-8">
            {/* Logo/Header */}
            <View className="items-center mb-8">
              <Image
                source={require('../../../assets/images/adaptive-icon.png')}
                className="w-24 h-24 mb-4 rounded-lg"
                resizeMode="contain"
              />
              <Text className="text-3xl font-bold text-primary mb-2">
                Welcome Back
              </Text>
              <Text className="text-muted text-center">
                Sign in to your account to continue
              </Text>
            </View>

            {/* Error Message */}
            {error && (
              <View className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <Text className="text-red-600 dark:text-red-400 text-sm">
                  {error.message}
                </Text>
              </View>
            )}

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-primary mb-1">
                Email Address
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="user@asianliftbd.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
                className="w-full px-4 py-3 border border-border rounded-lg 
                         bg-card text-primary"
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-primary mb-1">
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                autoComplete="password"
                editable={!loading}
                className="w-full px-4 py-3 border border-border rounded-lg 
                         bg-card text-primary"
              />
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={loading || !email || !password}
              className={`w-full py-3 rounded-lg items-center ${
                loading || !email || !password
                  ? 'bg-muted'
                  : 'bg-blue-600 active:bg-blue-700'
              }`}
            >
              <Text className="text-white font-semibold text-base">
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </Pressable>
          </Card>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}
