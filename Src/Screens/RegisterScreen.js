import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Input, Button, Text, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const signUp = () => {
    if (name && password && email) {
      setSubmitLoading(true);

      createUserWithEmailAndPassword(auth, email, password)
        .then((authUser) => {
          updateProfile(authUser.user, {
            displayName: name,
          }).then(() => {
            clearInput();
          });
        })
        .catch((err) => {
          alert(err.message);
          setSubmitLoading(false);
        });
    } else {
      alert("All Fields Are Mandatory");
      setSubmitLoading(false);
    }
  };

  const clearInput = () => {
    alert("Account created successfully");
    navigation.navigate("Home");
    setSubmitLoading(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <StatusBar style="light" />
        <Image
          source={{
            uri: "https://u7.uidownload.com/vector/771/239/vector-money-in-wallet-icon-psd-psd.jpg",
          }}
          style={{
            height: 100,
            width: 100,
            marginBottom: 50,
          }}
        />
        <Text h4 style={{ marginBottom: 50 }}>
          Create Account
        </Text>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Name"
            type="text"
            autoFocus
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChangeText={(mail) => setEmail(mail)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            secureTextEntry
            onChangeText={(pass) => setPassword(pass)}
          />
        </View>
        <Button
          containerStyle={styles.button}
          title="Register"
          onPress={signUp}
          loading={submitLoading}
        />
      </KeyboardAvoidingView>
    </>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
});
