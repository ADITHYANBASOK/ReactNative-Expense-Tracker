import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View, TextInput, KeyboardAvoidingView } from "react-native";
import { Button, Text } from "react-native-elements";
import { auth, db } from "../../firebase";
import { StatusBar } from "expo-status-bar";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState("expense");
  const [submitLoading, setSubmitLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add Expense",
    });
  }, [navigation]);


  const createExpense = async () => {
    console.log("Current user: ", auth.currentUser);

    if (!auth.currentUser) {
        alert("User not authenticated. Please log in.");
        return;
    }

    if (input && amount && date && selected) {
        setSubmitLoading(true);
        try {
            const numericPrice = parseFloat(amount); 

            if (isNaN(numericPrice)) {
                alert("Please enter a valid number for the price.");
                setSubmitLoading(false);
                return;
            }

            const docRef = await addDoc(collection(db, "expense"), {
                email: auth.currentUser.email,
                text: input,
                price: numericPrice, 
                type: selected,
                timestamp: serverTimestamp(),
                userDate: format(date, "dd/MM/yyyy"),
            });
            console.log("Document written with ID: ", docRef.id);
            clearInput();
        } catch (error) {
            alert(error.message);
        } finally {
            setSubmitLoading(false); 
        }
    } else {
        alert("All Fields Are Required");
        setSubmitLoading(false);
    }
};


  const clearInput = () => {
    alert("Created Successfully");
    setInput("");
    setAmount("");
    setDate(new Date());
    setSelected("expense");
    navigation.navigate("Home");
    setSubmitLoading(false);
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
      },
      mode: "date",
      is24Hour: true,
    });
  };

  const result = format(date, "dd/MM/yyyy");

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add Text"
          value={input}
          onChangeText={(text) => setInput(text)}
        />
        <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Add amount"
        value={amount}
        onChangeText={(number) => setAmount(number)}
      />
      <Text style={styles.input} onPress={showDatePicker}>
        {result}
      </Text>
      <Picker
        selectedValue={selected}
        onValueChange={(itemValue) => setSelected(itemValue)}
      >
        <Picker.Item label="Expense" value="expense" />
        <Picker.Item label="Income" value="income" />
      </Picker>
      <Button
        containerStyle={styles.button}
        title="Add"
        onPress={createExpense}
        loading={submitLoading}
      />
      </View>
      
    </KeyboardAvoidingView>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
});
