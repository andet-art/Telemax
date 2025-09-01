import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function CatalogScreen() {
  const categories = [
    { name: 'Briar Wood Pipes', count: '15 items', icon: 'leaf' as const },
    { name: 'Meerschaum Pipes', count: '8 items', icon: 'diamond' as const },
    { name: 'Corn Cob Pipes', count: '12 items', icon: 'nutrition' as const },
    { name: 'Artisan Collection', count: '5 items', icon: 'star' as const },
    { name: 'Vintage Collection', count: '7 items', icon: 'time' as const },
    { name: 'Beginner Pipes', count: '10 items', icon: 'heart' as const },
  ];

  return (
    <LinearGradient colors={theme.gradients.background} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Our Pipe Collection</Text>
          <Text style={styles.subtitle}>Handcrafted excellence in every piece</Text>
        </View>

        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <LinearGradient
                colors={[theme.colors.background.card, theme.colors.background.secondary]}
                style={styles.cardGradient}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={category.icon} size={32} color={theme.colors.accent.gold} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  categoryCard: {
    width: (width - 60) / 2,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 140,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  categoryCount: {
    fontSize: 12,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});
