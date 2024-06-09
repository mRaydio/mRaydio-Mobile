import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  Pressable,
  ReturnKeyTypeOptions,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {FC, useState} from 'react';
import {MediumText, RegularText, SmallText} from './Text';
import {SCREEN_WIDTH, isPhone} from '../constants/Variables';
import Colors from '../constants/Colors';
// import Down from '../assets/svg/down.svg';
import Eyeopen from '../assets/svg/input/eye.svg';
import Eyeclose from '../assets/svg/input/eye-slash.svg';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import LayoutAnimationComponent from './LayoutAnimationComponent';
import {ListDialog} from './Dialog';

interface ModalSelectorProps {
  style?: ViewStyle;
  bottom?: number;
  placeholder?: string;
  placeholderText?: string;
  inputStyle?: TextStyle;
  text: string | undefined;
  setText: (text: string) => void;
  search: boolean;
  height: number;
  data: any[];
}

// export const ModalSelector: FC<ModalSelectorProps> = ({
//   style,
//   bottom = 20,
//   placeholder,
//   placeholderText,
//   inputStyle,

//   text,
//   setText,
//   search,
//   height,
//   data,
// }) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const styles = StyleSheet.create({
//     mainView: {
//       alignItems: 'center',
//       borderBottomWidth: 3,
//       borderColor: Colors.primary,
//       flexDirection: 'row',
//       height: 50,
//       marginBottom: bottom,
//       ...style,
//     },
//     textStyle: {
//       color: 'white',
//       flex: 1,
//       fontFamily: 'Gilroy-Bold',
//       fontSize: 17,
//       ...inputStyle,
//     },
//   });

//   return (
//     <>
//       <TouchableOpacity
//         onPress={() => {
//           setModalVisible(true);
//         }}>
//         {placeholderText && (
//           <RegularText style={{marginBottom: 8}}>{placeholderText}</RegularText>
//         )}
//         <View style={styles.mainView}>
//           <SmallText style={styles.textStyle}>{text ?? placeholder}</SmallText>

//           <Down color={Colors.primary} />
//         </View>
//       </TouchableOpacity>
//       <ListDialog
//         searchShow={search}
//         height={height}
//         data={data}
//         closeModal={() => setModalVisible(false)}
//         open={modalVisible}
//         onPress={(data: string) => {
//           setModalVisible(false);
//           setText(data);
//         }}
//       />
//     </>
//   );
// };

interface OtpInputProps {
  setOtp: (otp: string) => void;
  otp: string | undefined;
  num?: number;
}

export const OtpInput: FC<OtpInputProps> = ({setOtp, otp, num = 6}) => {
  const ref = useBlurOnFulfill({value: otp, cellCount: 6});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otp,
    setValue: setOtp,
  });
  const SIZE =
    ((isPhone ? SCREEN_WIDTH : SCREEN_WIDTH / 2) - 40 - 15 * (num - 1)) / num;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
      }}>
      <CodeField
        ref={ref}
        {...props}
        value={otp}
        onChangeText={setOtp}
        cellCount={6}
        rootStyle={{marginBottom: 30, justifyContent: 'space-between'}}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <LayoutAnimationComponent
            key={index}
            leftInOut
            exitDelay={100 + index * 100}
            delay={1000 + index * 100}>
            <View
              style={{
                width: SIZE,
                height: SIZE,
                marginRight: index + 1 === num ? 0 : 15,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 3,
                borderRadius: 10,
                borderColor: symbol || isFocused ? Colors.primary : '#ffffff30',
              }}>
              <MediumText
                style={{color: Colors.primary}}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </MediumText>
            </View>
          </LayoutAnimationComponent>
        )}
      />
    </View>
  );
};

interface InputProps {
  style?: ViewStyle;
  bottom?: number;
  placeholder?: string;
  placeholderText?: string;
  inputStyle?: TextStyle;
  password?: boolean;
  keyboard?: KeyboardTypeOptions;
  handleKeyPress?: (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => void | undefined;
  multiline?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  text: string;
  setText: (text: string) => void;
  maxLength?: number;
  editable?: boolean;
  testID?: string;
}

const Input: FC<InputProps> = ({
  style,
  bottom = 20,
  placeholder,
  description,
  inputStyle,
  password,
  keyboard = 'default',
  handleKeyPress,
  multiline,
  returnKeyType,
  onSubmitEditing,
  text,
  setText,
  maxLength,
  editable,
  testID,
}) => {
  const [hide, setHide] = useState(password);
  const [focused, setFocused] = useState(false);

  const styles = StyleSheet.create({
    input: {
      color: 'white',
      flex: description ? 0 : 1,
      fontFamily: 'Montserrat-Medium',
      fontSize: 15,
      height: 45,
      padding: 0,
      ...inputStyle,
    },
    mainView: {
      borderWidth: 1,
      borderRadius: 10,
      height: description ? 150 : 55,
      paddingHorizontal: 15,
      borderColor: focused || text ? Colors.primary : Colors.dim,
      marginBottom: bottom,
      paddingVertical: 8,
      justifyContent: description ? 'flex-start' : 'center',
      ...style,
    },
  });

  return (
    <>
      <Pressable
        onPress={() => {
          setFocused(true);
        }}
        style={styles.mainView}>
        <SmallText
          dim
          style={{fontSize: focused || text ? 12 : 14, marginBottom: 2}}>
          {placeholder}
        </SmallText>
        {(focused || text) && (
          <TextInput
            autoFocus
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
            }}
            testID={testID}
            editable={editable}
            maxLength={maxLength}
            value={text}
            cursorColor={Colors.primary}
            selectionColor={Colors.primary}
            onChangeText={setText}
            returnKeyType={returnKeyType}
            multiline={description || multiline}
            keyboardType={keyboard}
            secureTextEntry={hide}
            style={styles.input}
            onKeyPress={handleKeyPress}
            onSubmitEditing={onSubmitEditing}
          />
        )}
        {password && (
          <TouchableOpacity
            onPress={() => setHide(p => !p)}
            style={{
              right: 15,
              position: 'absolute',
            }}>
            {hide ? (
              <Eyeclose height={15} width={15} />
            ) : (
              <Eyeopen height={15} width={15} />
            )}
          </TouchableOpacity>
        )}
      </Pressable>
    </>
  );
};

export default Input;

const styles = StyleSheet.create({});
