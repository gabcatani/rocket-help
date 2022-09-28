import { VStack, Heading, Icon, useTheme } from "native-base";
import { Envelope, Key } from 'phosphor-react-native';
import auth from '@react-native-firebase/auth';
import { Alert } from "react-native";
import { Button } from "../components/Button";

import Logo from "../assets/logo_primary.svg";
import { Input } from "../components/Input";
import { useState } from "react";

export function SignIn() {

  const [isLoding, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { colors } = useTheme();

  function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Informe Email e Senha');
      return;
    }

    setIsLoading(true);

    auth().signInWithEmailAndPassword(email, password)
      .catch(error => {
        Alert.alert(error.message);
        setIsLoading(false);

        if (error.code === 'auth/user-not-found') {
          Alert.alert('Usuário não encontrado');
        }

        if (error.code === 'auth/wrong-password') {
          Alert.alert('Senha incorreta');
        }

        if (error.code === 'auth/invalid-email') {
          Alert.alert('Email inválido');
        }

        return Alert.alert('Não foi possível realizar o login');

      })

    console.log(name, password);
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
        <Logo />
        <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
            Acesse sua conta
        </Heading>
        <Input  
            placeholder="E-mail" 
            mb={4} 
            InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
            onChangeText={setEmail}

        />

        <Input 
            placeholder="Senha" 
            mb={8}
            InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
            secureTextEntry
            onChangeText={setPassword}
        />

          <Button 
            title="Entrar" 
            w="full" 
            onPress={handleSignIn} 
            isLoading={isLoding}  
          />
    </VStack>
  );
}