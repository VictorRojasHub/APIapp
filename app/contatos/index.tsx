import { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../lib/api';
import { global } from '../../styles/global';
import { Contato } from '../../types/Contato';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ListaContatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const router = useRouter();

  const carregar = async () => {
    try {
      const { data } = await api.get('/contatos');
      setContatos(data);
    } catch (err) {
      Alert.alert('Erro ao carregar contatos');
    }
  };

  const excluir = async (id: string) => {
    try {
      await api.delete(`/contatos/${id}`);
      carregar();
    } catch {
      Alert.alert('Erro ao excluir');
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregar(); // sua função para carregar dados
    }, [])
  );

  return (
    <View style={global.container}>
      <Button title="Novo contato" onPress={() => router.push('/contatos/novo')} />
      <FlatList
        data={contatos}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => ( //diz como é que cada item da lista vai ser renderizado
          // TouchableOpacity torna o item clicável
          // onPress leva para a tela de detalhes do contato
          // router.push leva para a tela de detalhes do contato
          // Exibe o nome e a foto do contato, se houver
          // Inclui um botão para excluir o contato
          // Ao clicar no botão, chama a função excluir passando o id do contato
          <TouchableOpacity onPress={() => router.push(`/contatos/${item._id}`)}>
            <Text>{item.nome}</Text>
            <Text>{item.email}</Text>
            <Text>{item.telefone}</Text> 
            {item.foto && (
              <Image
                source={{ uri: `https://api-cont-auth-nijo.onrender.com/uploads/${item.foto}` }}
                style={{ width: 100, height: 100 }}
              />
            )}
            <Button title="Excluir" onPress={() => excluir(item._id)} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
