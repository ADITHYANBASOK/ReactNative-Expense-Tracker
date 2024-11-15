import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import { auth, db } from "../../firebase"; 
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"; 
import CustomListItem from "../Components/CustomListItem";

const HomeScreen = ({ navigation }) => {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState([]);

    useEffect(() => {
    
        console.log("Current User: ", auth.currentUser);
        console.log("hai");
    
        const q = query( 
            collection(db, "expense"),
            orderBy("timestamp", "desc")
        );
    
        console.log("hello");
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Snapshot: ", snapshot);  
            if (snapshot.empty) {
                console.log("No documents found!");
                return;
            }
    
            try {
                const fetchedTransactions = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));
                const userTransactions = fetchedTransactions.filter(
                    (transaction) => transaction.data.email === auth.currentUser.email
                );
                console.log("Fetched Transactions: ", fetchedTransactions);
                setFilter(userTransactions);
                setTransactions(fetchedTransactions);
                calculateTotals(fetchedTransactions);
            } catch (error) {
                console.error("Error fetching transactions: ", error);
            }
        }, (error) => {
            console.error("Error in snapshot listener: ", error);
        });
        
    
        return unsubscribe;

    }, []);
    

    const calculateTotals = (transactions) => {
        const userTransactions = transactions.filter(
          (transaction) => transaction.data.email === auth.currentUser.email
        );
      console.log("hai",userTransactions)
        const income = userTransactions
          .filter((transaction) => transaction.data.type === "income")
          .reduce((acc, transaction) => acc + parseFloat(transaction.data.price || 0), 0);
      
        const expense = userTransactions
          .filter((transaction) => transaction.data.type === "expense")
          .reduce((acc, transaction) => acc + parseFloat(transaction.data.price || 0), 0);
      
        setTotalIncome(income || 0); 
        setTotalExpense(expense || 0); 
        setTotalBalance((income || 0) - (expense || 0)); 
      };

    const signOutUser = () => {

        auth
            .signOut()
            .then(() => navigation.navigate("Login"))
            .catch((error) => alert(error.message));
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `${auth.currentUser.displayName}`,
            headerRight: () => (
                <View style={{ marginRight: 20 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <Text style={{ fontWeight: "bold" }}>Logout</Text>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation,auth.currentUser.displayName]);

    return (
        <>
            <View style={styles.container}>
                <StatusBar style="dark" />
                <View style={styles.card}>
                    <View style={styles.cardTop}>
                        <Text style={{ alignItems: "center", color: "white" }}>
                            Total Balance
                        </Text>
                        <Text style={{ alignItems: "center", color: "white" }} h3>
                        ${totalBalance.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.cardBottom}>
                        <View>
                            <View style={styles.cardBottomSame}>
                                <Feather name="arrow-down" size={18} color="green" />
                                <Text style={{ textAlign: "center", marginLeft: 5 }}>
                                    Income
                                </Text>
                            </View>
                            <Text h4 style={{ textAlign: "center" }}>
                            {`$ ${totalIncome.toFixed(2)}`}
                            </Text>
                        </View>
                        <View>
                            <View style={styles.cardBottomSame}>
                                <Feather name="arrow-up" size={18} color="red" />
                                <Text style={{ textAlign: "center", marginLeft: 5 }}>
                                    Expense
                                </Text>
                            </View>
                            <Text h4 style={{ textAlign: "center" }}>
                            {`$ ${totalExpense.toFixed(2)}`}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.recentTitle}>
                    <Text h4>Recent Transactions</Text>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate("All")}
                    >
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                {filter.length > 0 ? (
                    <View style={styles.recentTransactions}>
                        {filter.slice(0, 3).map((info) => (
                            <View key={info.id}>
                                <CustomListItem
                                    info={info.data}
                                    navigation={navigation}
                                    id={info.id}
                                />
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.containerNull}>
                        <FontAwesome5 name="list-alt" size={24} />
                        <Text h4>No Transactions</Text>
                    </View>
                )}
            </View>
            <View style={styles.addButton}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate("Home")}
                >
                    <AntDesign name="home" size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate("Add")}
                >
                    <AntDesign name="plus" size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate("All")}
                >
                    <FontAwesome5 name="list-alt" size={24} />
                </TouchableOpacity>
            </View>
        </>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 10,
    },
    card: {
        backgroundColor: "black",
        alignItems: "center",
        width: "100%",
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        marginVertical: 20,
    },
    cardBottom: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        backgroundColor: "#E0D1EA",
        borderRadius: 5,
    },
    cardBottomSame: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    recentTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    recentTransactions: {
        backgroundColor: "white",
        width: "100%",
    },
    seeAll: {
        fontWeight: "bold",
        color: "green",
        fontSize: 16,
    },
    addButton: {
        position: "absolute",
        bottom: 0,
        padding: 10,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.58,
        shadowRadius: 16.0,
        elevation: 24,
    },
    containerNull: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        width: "100%",
    },
});
