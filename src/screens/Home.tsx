import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { dateFormat } from '../utils/firestoreDateFormat';

import Logo from '../assets/logo_secondary.svg';
import { SignOut, ChatTeardropText } from 'phosphor-react-native';
import { Filter } from '../components/Filter';
import { Order, OrderProps } from '../components/Order';

import { useEffect, useState } from 'react';
import { Button } from '../components/Button';

export function Home() {
    
    const { colors } = useTheme();
    const [ statusSelected, setStatusSelected ] = useState<'open' | 'closed' >('open');
    const [ orders, setOrders ] = useState<OrderProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation();

    function handleNewOrder() {
        navigation.navigate('Register')
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('Details', { orderId })
    }

    function handleLogout() {
        auth()
        .signOut()
        .catch(error => {
            Alert.alert(error.message);
        })
    }

    useEffect(() => {
        setIsLoading(true);
    
        const subscriber = firestore()
          .collection('orders')
          .where('status', '==', statusSelected)
          .onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => {
              const { patrimony, description, status, created_at } = doc.data();
    
              return {
                id: doc.id,
                patrimony,
                description,
                status,
                when: dateFormat(created_at)
              }
            });
    
            setOrders(data);
            setIsLoading(false);
          });
    
        return subscriber;
      }, [statusSelected]);

    return (
    <VStack flex={1} pb={6} bg= "gray.700">
        <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            bg= "gray.600"
            pt={12}
            pb={5}
            px={6}
        >
            <Logo width={100} height={40} />

            <IconButton 
                icon={<SignOut size={26} color={colors.gray[300]} />}
            />

        </HStack>
        <VStack flex={1} px={6}>
            <HStack w="full" mt={4} mb={4} justifyContent="space-between" alignItems="center">
                <Heading color="gray.100">
                    Meus chamados
                </Heading>

                <Text color="gray.200" fontSize={20}>
                    3
                </Text>
            </HStack>

            <HStack space={3} mb={8}>
                <Filter 
                    title="Em Andamendo" 
                    type="open"
                    onPress={() => setStatusSelected('open')}
                    isActive={statusSelected === 'open'} 
                    />

                <Filter 
                    title="Finalizados" 
                    type="open" 
                    onPress={() => setStatusSelected('closed')}
                    isActive={statusSelected === 'closed'} 
                />

            </HStack>

            <FlatList 
                data={orders}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)}/>}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
                ListEmptyComponent={() => (
                    <Center mt={10}>
                        <ChatTeardropText color={colors.gray[300]} size={150} />
                        <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                            Você não possui {'\n'}
                            solicitações {statusSelected === 'open' ? 'abertas.' : 'finalizadas.'}
                        </Text>
                    </Center>
                )}
            />

            <Button 
                title="Nova Solicitação" 
                onPress={handleNewOrder}
            /> 

        </VStack>

        
    </VStack>
  );
}