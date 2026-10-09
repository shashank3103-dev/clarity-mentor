import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Avatar from '../common/Avatar';
import {colors} from '../../theme';
export default function SessionCard({session}) { return <View style={styles.card}><Avatar label={session.mentor?.image}/><View style={styles.info}><Text style={styles.name}>{session.mentor?.name}</Text><Text style={styles.meta}>{session.date} · {session.time}</Text></View></View>; }
const styles=StyleSheet.create({card:{padding:14,borderRadius:15,backgroundColor:colors.white,flexDirection:'row'},info:{marginLeft:12},name:{fontWeight:'800',color:colors.primary},meta:{color:colors.textSecondary,marginTop:4}});
