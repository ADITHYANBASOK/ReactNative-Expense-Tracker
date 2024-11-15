import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "react-native-elements";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomListItem from "../Components/CustomListItem";
import { auth, db } from "../../firebase";
import { collection, orderBy, onSnapshot, query } from "firebase/firestore"; 
const AllTransactions = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "All Transactions",
    });
  }, [navigation]);

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "expense"), orderBy("timestamp", "desc")); 
    const unsubscribe = onSnapshot(q, (snapshot) =>
      setTransactions(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (transactions) {
      setFilter(
        transactions.filter(
          (transaction) => transaction.data.email === auth.currentUser.email
        )
      );
    }
  }, [transactions]);

  return (
    <>
      {filter.length > 0 ? (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            {filter.map((info) => (
              <View key={info.id}>
                <CustomListItem
                  info={info.data}
                  navigation={navigation}
                  id={info.id}
                />
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      ) : (
        <View style={styles.containerNull}>
          <FontAwesome5 name="list-alt" size={24} />
          <Text h4 style={{ color: "green" }}>
            No Transactions
          </Text>
        </View>
      )}
    </>
  );
};

export default AllTransactions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 0,
    marginTop: -23,
  },
  containerNull: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

