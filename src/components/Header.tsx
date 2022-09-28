import { HStack, IconButton, useTheme, StyledProps, Heading } from 'native-base';
import { CaretLeft } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

type Props = StyledProps & {
    title: string
}

export function Header({ title, ...rest }: Props) {

    const navigation = useNavigation();
    const { colors } = useTheme();

    function handleGoBack() {
        navigation.goBack();
    }

  return (
    <HStack
        w="full"
        alignItems="center"
        justifyContent="space-between"
        bg="gray.600"
        pt={12}
        pb={6}
        {...rest}
    >
        <IconButton icon={<CaretLeft size={24} color={colors.gray[300]} />} onPress={handleGoBack}/>
        <Heading color="gray.100" textAlign="center" fontSize="lg" flex={1} ml={-6} >
            {title}
        </Heading>
    </HStack>
  );
}