import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function CartScreen({ navigation }: any) {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Classic Briar Wood',
      price: 89.99,
      quantity: 1,
      image: 'leaf',
      description: 'Handcrafted premium briar wood pipe'
    },
    {
      id: 2,
      name: 'Vintage Meerschaum',
      price: 159.99,
      quantity: 2,
      image: 'diamond',
      description: 'Authentic meerschaum pipe with elegant design'
    }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeItem = (id: number) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setCartItems(prev => prev.filter(item => item.id !== id))
        }
      ]
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      'This will redirect to our secure payment portal.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => Alert.alert('Success', 'Order placed successfully! You will receive a confirmation email shortly.')
        }
      ]
    );
  };

  if (cartItems.length === 0) {
    return (
      <LinearGradient colors={theme.gradients.background} style={styles.container}>
        <View style={styles.emptyContainer}>
          <LinearGradient
            colors={[theme.colors.background.card, theme.colors.background.secondary]}
            style={styles.emptyCard}
          >
            <Ionicons name="bag-outline" size={80} color={theme.colors.text.muted} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Browse our exquisite collection of handcrafted pipes and find your perfect match
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Catalog')}
            >
              <LinearGradient
                colors={theme.gradients.primary}
                style={styles.browseButtonGradient}
              >
                <Text style={styles.browseButtonText}>Browse Pipes</Text>
                <Ionicons name="arrow-forward" size={20} color={theme.colors.background.primary} />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={theme.gradients.background} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Your Items ({cartItems.length})</Text>
          
          {cartItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <LinearGradient
                colors={[theme.colors.background.card, theme.colors.background.secondary]}
                style={styles.itemGradient}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.itemImageContainer}>
                    <Ionicons name={item.image as any} size={32} color={theme.colors.accent.gold} />
                  </View>
                  
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Ionicons name="remove" size={20} color={theme.colors.accent.gold} />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Ionicons name="add" size={20} color={theme.colors.accent.gold} />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <LinearGradient
            colors={[theme.colors.background.card, theme.colors.background.secondary]}
            style={styles.summaryCard}
          >
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={[styles.summaryValue, shipping === 0 && styles.freeShipping]}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </Text>
            </View>
            
            {shipping === 0 && (
              <Text style={styles.freeShippingNote}>
                í¾‰ Free shipping on orders over $100!
              </Text>
            )}
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (8%)</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Checkout Button */}
        <View style={styles.checkoutContainer}>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <LinearGradient
              colors={theme.gradients.primary}
              style={styles.checkoutGradient}
            >
              <Ionicons name="card" size={24} color={theme.colors.background.primary} />
              <Text style={styles.checkoutText}>Secure Checkout</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.securityInfo}>
            <Ionicons name="shield-checkmark" size={16} color={theme.colors.success} />
            <Text style={styles.securityText}>256-bit SSL encrypted checkout</Text>
          </View>
        </View>

        {/* Continue Shopping */}
        <View style={styles.continueContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('Catalog')}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.accent.gold} />
            <Text style={styles.continueText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.xxl,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  browseButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  browseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  browseButtonText: {
    color: theme.colors.background.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemsContainer: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  itemCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  itemGradient: {
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  itemDescription: {
    fontSize: 14,
    color: theme.colors.text.muted,
    lineHeight: 18,
    marginBottom: theme.spacing.xs,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.accent.gold,
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.secondary,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.md,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.accent.gold,
  },
  summaryContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  summaryCard: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  summaryLabel: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  freeShipping: {
    color: theme.colors.success,
  },
  freeShippingNote: {
    fontSize: 12,
    color: theme.colors.success,
    fontStyle: 'italic',
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
    textAlign: 'right',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.secondary,
    paddingTop: theme.spacing.md,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.accent.gold,
  },
  checkoutContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  checkoutButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  checkoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  checkoutText: {
    color: theme.colors.background.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  securityText: {
    fontSize: 12,
    color: theme.colors.success,
  },
  continueContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
    paddingBottom: theme.spacing.xxl,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  continueText: {
    fontSize: 16,
    color: theme.colors.accent.gold,
    fontWeight: '600',
  },
});
