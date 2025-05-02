import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../../assets/logo.png';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 30,
        color: '#2c3e50'
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        color: '#3498db'
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center'
    },
    certificate: {
        border: '2px solid #3498db',
        padding: 30,
        borderRadius: 10
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
        alignSelf: 'center'
    }
});

const Certificate = ({ username, courseTitle, score, totalQuestions }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.certificate}>
                <Image
                    src={logo}
                    style={styles.logo}
                />
                <Text style={styles.header}>Certificate of Completion</Text>
                <Text style={styles.text}>This is to certify that</Text>
                <Text style={styles.title}>{username}</Text>
                <Text style={styles.text}>has successfully completed the course</Text>
                <Text style={styles.title}>{courseTitle}</Text>
                <Text style={styles.text}>with a score of {score} out of {totalQuestions}</Text>
                <Text style={styles.text}>on {new Date().toLocaleDateString()}</Text>
            </View>
        </Page>
    </Document>
);

export default Certificate;