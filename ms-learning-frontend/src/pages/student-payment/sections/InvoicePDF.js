import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
        padding: 20
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333'
    },
    title: {
        fontSize: 18,
        marginBottom: 10
    },
    text: {
        fontSize: 12,
        marginBottom: 5
    },
    divider: {
        borderBottomColor: '#333',
        borderBottomWidth: 1,
        marginVertical: 10
    }
});

const InvoicePDF = ({ payment }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>INVOICE</Text>

                <Text style={styles.title}>Payment Details</Text>
                <Text style={styles.text}>Invoice #: {payment.id}</Text>
                <Text style={styles.text}>Date: {new Date(payment.paymentDate).toLocaleDateString()}</Text>
                <Text style={styles.text}>Amount: ${payment.price}</Text>

                <View style={styles.divider} />

                <Text style={styles.title}>Item Purchased</Text>
                {payment.type === 'course' && (
                    <Text style={styles.text}>Course: {payment.item.title}</Text>
                )}
                {payment.type === 'subscription' && (
                    <Text style={styles.text}>Subscription: {payment.item.title}</Text>
                )}

                <View style={styles.divider} />

                <Text style={styles.title}>Thank you for your purchase!</Text>
            </View>
        </Page>
    </Document>
);

export default InvoicePDF;