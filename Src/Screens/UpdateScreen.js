import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { format, parse } from "date-fns";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, TextInput, KeyboardAvoidingView } from "react-native";
import { Button, Text } from "react-native-elements";
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { StatusBar } from "expo-status-bar";

const UpdateScreen = ({ route, navigation }) => {
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState("expense");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");

  const { itemId } = route.params;  

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "expense", itemId), (snapshot) => {
      setInput(snapshot.data()?.text || "");
      setAmount(snapshot.data()?.price?.toString() ?? "");
      setDate(parse(snapshot.data()?.userDate || "", "dd/MM/yyyy", new Date()));
      setSelected(snapshot.data()?.type || "expense");
    });
    return unsubscribe;
  }, [itemId]);
  

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Update Expense",
    });
  }, [navigation]);

  const updateExpense = () => {
    if (input && amount && date && selected) {
      setSubmitLoading(true);
      updateDoc(doc(db, "expense", itemId), {
        text: input,
        price: amount,
        type: selected,
        timestamp: new Date(),
        userDate: format(date, "dd/MM/yyyy"),
      })
      
        .then(() => clearInput())
        .catch((error) => {
          alert(error.message);
          setSubmitLoading(false);
        });
    } else {
      alert("All Fields Are Required");
    }
  };

  const clearInput = () => {
    alert("Updated Successfully");
    setInput("");
    setAmount("");
    setDate(new Date());
    setSelected("expense");
    navigation.navigate("Home");
    setSubmitLoading(false);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatePicker = () => {
    showMode("date");
  };

  const onChange = (event, selectedData) => {
    const currentDate = selectedData || date;
    setDate(currentDate);
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
        {show && (
          <DateTimePickerAndroid
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Add amount"
        value={amount}
        onChangeText={(number) => setAmount(number)}
      />
      <Text style={styles.input} onPress={showDatePicker}>
        {result ? result : new Date()}
      </Text>
      <Picker
        selectedValue={selected}
        onValueChange={(itemvalue) => setSelected(itemvalue)}
      >
        <Picker.Item label="Expense" value="expense" />
        <Picker.Item label="Income" value="income" />
      </Picker>
      <Button
        containerStyle={styles.button}
        title="Update"
        onPress={updateExpense}
        loading={submitLoading}
      />
      </View>
      
    </KeyboardAvoidingView>
  );
};

export default UpdateScreen;

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
