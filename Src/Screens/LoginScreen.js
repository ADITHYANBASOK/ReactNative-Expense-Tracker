import React ,{useEffect, useLayoutEffect, useState} from "react"
import { StatusBar } from "expo-status-bar";
import { View,  StyleSheet } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Image, Input, Button ,Text} from "react-native-elements";
import { auth } from "../../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; 
const LoginScreen = ({navigation}) => {
    const [email ,setEmail]=useState("");
    const [password, setPassword] = useState("");
    const [submitLoading , setSubmitLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const signIn = () => {
      if (email && password) {
        setSubmitLoading(true);
  
        signInWithEmailAndPassword(auth, email, password)
          .then(() => clearInput()) 
          .catch((error) => {
            alert(error.message); 
            setSubmitLoading(false);
          });
      } else {
        alert("All Fields Are Mandatory");
        setSubmitLoading(false); 
      }
    };
  
    const clearInput = () => {
      alert("Successfully Logged In");
      navigation.replace("Home");
      setSubmitLoading(false);
      setEmail("");
      setPassword("");
    };

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((authUser)=>{
            if (authUser){
                navigation.replace("Home");
                setLoading(false)

            }else{
                setLoading(false)
            }
        });
        return unsubscribe;
    }, [])
    
    useLayoutEffect(()=>{
        navigation.setOptions({
            title: "Loading...",
        });
        if (!loading){
            navigation.setOptions({
                title: "Login",
            });
        }
    }, [navigation,loading])

  return (
    <>
    {!loading ?(<KeyboardAvoidingView behavior="padding" style={styles.container}>
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
      <View style={styles.inputContainer}>
        <Input 
        type="email" 
        placeholder="email"
        value={email}
        onChangeText={(text)=>setEmail(text)}
         />
        <Input 
        type="password" 
        placeholder="password" 
        secureTextEntry
        value={password}
        onChangeText={(pass)=>setPassword(pass)}
        onSubmitEditing={signIn}
        />
        <Button
         title="Login"
         containerStyle={styles.button}
         onPress={signIn}
          />

        <Button
         title="Register" 
         containerStyle={styles.button}
         onPress={()=>{
            navigation.navigate("Register")
         }}
          />
      </View>
    </KeyboardAvoidingView>):
    (<View>
        <Image
        source={{
          uri: "https://u7.uidownload.com/vector/666/533/vector-icon-sticker-realistic-design-on-paper-purse-vector-eps-10-210747.jpg",
        }}
        style={{
          height: 100,
          width: 100,
          marginBottom: 50,
        }}
      />
      <Text h4>Loading</Text>
    </View>)
    }
    </>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
})
