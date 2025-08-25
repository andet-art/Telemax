import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const scrollViewRef = useRef<ScrollView>(null);

  const featuredPipes = [
    { 
      id: 1,
      name: 'Classic Briar Wood', 
      price: 89.99, 
      originalPrice: 109.99,
      icon: 'leaf' as const,
      rating: 4.8,
      reviews: 124,
      tags: ['Premium', 'Handcrafted']
    },
    { 
      id: 2,
      name: 'Vintage Meerschaum', 
      price: 159.99, 
      originalPrice: null,
      icon: 'diamond' as const,
      rating: 4.9,
      reviews: 89,
      tags: ['Luxury', 'Limited']
    },
    { 
      id: 3,
      name: 'Artisan Special', 
      price: 229.99, 
      originalPrice: 279.99,
      icon: 'star' as const,
      rating: 5.0,
      reviews: 45,
      tags: ['Exclusive', 'Award Winner']
    },
  ];

  const features = [
    { icon: 'hammer' as const, title: 'Handcrafted', text: 'Made by skilled artisans with 70+ years experience' },
    { icon: 'shield-checkmark' as const, title: 'Quality Guaranteed', text: 'Premium materials with lifetime warranty' },
    { icon: 'rocket' as const, title: 'Fast Shipping', text: 'Worldwide delivery in 2-5 business days' },
    { icon: 'star' as const, title: 'Best Quality', text: 'Award-winning craftsmanship since 1950' },
  ];

  const testimonials = [
    { text: "The finest pipe I've ever owned. Exceptional craftsmanship!", author: "Michael R." },
    { text: "Outstanding quality and beautiful design. Highly recommended!", author: "Sarah L." },
    { text: "A true work of art. The attention to detail is remarkable.", author: "James W." },
  ];

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' }}
        style={styles.heroSection}
        imageStyle={styles.heroImage}
      >
        <LinearGradient
          colors={['rgba(26, 18, 11, 0.8)', 'rgba(26, 18, 11, 0.6)']}
          style={styles.heroOverlay}
        >
          <Ionicons name="leaf" size={80} color={theme.colors.accent.gold} />
          <Text style={styles.heroTitle}>Welcome to Telemax</Text>
          <Text style={styles.heroSubtitle}>Premium Tobacco Pipes Since 1950</Text>
          <Text style={styles.heroDescription}>
            Discover our exquisite collection of handcrafted pipes, 
            made with premium materials and traditional techniques passed down through generations.
          </Text>
          
          <TouchableOpacity 
            style={styles.heroButton}
            onPress={() => navigation.navigate('Catalog')}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              style={styles.heroButtonGradient}
            >
              <Text style={styles.heroButtonText}>Explore Collection</Text>
              <Ionicons name="arrow-forward" size={20} color={theme.colors.background.primary} />
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Telemax?</Text>
        <Text style={styles.sectionSubtitle}>
          Four decades of excellence in tobacco pipe craftsmanship
        </Text>
        
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <LinearGradient
                colors={[theme.colors.background.card, theme.colors.background.secondary]}
                style={styles.featureCardGradient}
              >
                <View style={styles.featureIconContainer}>
                  <Ionicons name={feature.icon} size={28} color={theme.colors.accent.gold} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </LinearGradient>
            </View>
          ))}
        </View>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Featured Pipes</Text>
            <Text style={styles.sectionSubtitle}>
              Handpicked by our master craftsmen
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Catalog')}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="arrow-forward" size={16} color={theme.colors.accent.gold} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pipesScrollContainer}
        >
          {featuredPipes.map((pipe, index) => (
            <TouchableOpacity 
              key={pipe.id} 
              style={styles.pipeCard}
              onPress={() => navigation.navigate('ProductDetail', { pipe })}
            >
              <LinearGradient
                colors={[theme.colors.background.card, theme.colors.background.secondary]}
                style={styles.pipeCardGradient}
              >
                <View style={styles.pipeImageContainer}>
                  <Ionicons name={pipe.icon} size={48} color={theme.colors.accent.gold} />
                  {pipe.originalPrice && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>
                        -{Math.round(((pipe.originalPrice - pipe.price) / pipe.originalPrice) * 100)}%
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.pipeInfo}>
                  <Text style={styles.pipeName}>{pipe.name}</Text>
                  
                  <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons 
                          key={i}
                          name={i < Math.floor(pipe.rating) ? "star" : "star-outline"} 
                          size={12} 
                          color={theme.colors.accent.gold} 
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewText}>({pipe.reviews})</Text>
                  </View>
                  
                  <View style={styles.tagsContainer}>
                    {pipe.tags.slice(0, 2).map((tag, i) => (
                      <View key={i} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.pipePrice}>${pipe.price}</Text>
                    {pipe.originalPrice && (
                      <Text style={styles.originalPrice}>${pipe.originalPrice}</Text>
                    )}
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Testimonials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Our Customers Say</Text>
        <Text style={styles.sectionSubtitle}>
          Join thousands of satisfied pipe enthusiasts worldwide
        </Text>
        
        <View style={styles.testimonialsContainer}>
          {testimonials.map((testimonial, index) => (
            <View key={index} style={styles.testimonialCard}>
              <LinearGradient
                colors={[theme.colors.background.card, theme.colors.background.secondary]}
                style={styles.testimonialGradient}             >
               <Ionicons name="quote" size={24} color={theme.colors.accent.gold} style={styles.quoteIcon} />
               <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
               <View style={styles.testimonialAuthor}>
                 <Text style={styles.authorName}>— {testimonial.author}</Text>
                 <View style={styles.starsContainer}>
                   {[...Array(5)].map((_, i) => (
                     <Ionicons key={i} name="star" size={12} color={theme.colors.accent.gold} />
                   ))}
                 </View>
               </View>
             </LinearGradient>
           </View>
         ))}
       </View>
     </View>

     {/* Call to Action */}
     <View style={styles.ctaSection}>
       <LinearGradient
         colors={[theme.colors.background.card, theme.colors.background.secondary]}
         style={styles.ctaContainer}
       >
         <Ionicons name="leaf" size={48} color={theme.colors.accent.gold} />
         <Text style={styles.ctaTitle}>Start Your Pipe Journey</Text>
         <Text style={styles.ctaDescription}>
           Browse our complete collection or create your custom pipe today
         </Text>
         
         <View style={styles.ctaButtons}>
           <TouchableOpacity 
             style={styles.primaryButton}
             onPress={() => navigation.navigate('Catalog')}
           >
             <LinearGradient
               colors={theme.gradients.primary}
               style={styles.buttonGradient}
             >
               <Text style={styles.primaryButtonText}>Browse Pipes</Text>
             </LinearGradient>
           </TouchableOpacity>
           
           <TouchableOpacity 
             style={styles.secondaryButton}
             onPress={() => navigation.navigate('Contact')}
           >
             <Text style={styles.secondaryButtonText}>Custom Order</Text>
           </TouchableOpacity>
         </View>
       </LinearGradient>
     </View>
   </ScrollView>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: theme.colors.background.primary,
 },
 heroSection: {
   height: 400,
   justifyContent: 'center',
   alignItems: 'center',
 },
 heroImage: {
   opacity: 0.3,
 },
 heroOverlay: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   paddingHorizontal: theme.spacing.lg,
   width: '100%',
 },
 heroTitle: {
   fontSize: 32,
   fontWeight: 'bold',
   color: theme.colors.text.primary,
   textAlign: 'center',
   marginTop: theme.spacing.md,
 },
 heroSubtitle: {
   fontSize: 18,
   color: theme.colors.accent.gold,
   textAlign: 'center',
   marginTop: theme.spacing.xs,
   fontWeight: '600',
 },
 heroDescription: {
   fontSize: 16,
   color: theme.colors.text.secondary,
   textAlign: 'center',
   marginTop: theme.spacing.md,
   lineHeight: 24,
   maxWidth: 300,
 },
 heroButton: {
   marginTop: theme.spacing.xl,
   borderRadius: theme.borderRadius.xl,
   overflow: 'hidden',
 },
 heroButtonGradient: {
   flexDirection: 'row',
   alignItems: 'center',
   paddingVertical: theme.spacing.md,
   paddingHorizontal: theme.spacing.xl,
   gap: theme.spacing.sm,
 },
 heroButtonText: {
   color: theme.colors.background.primary,
   fontSize: 16,
   fontWeight: 'bold',
 },
 section: {
   padding: theme.spacing.lg,
 },
 sectionHeader: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'flex-start',
   marginBottom: theme.spacing.lg,
 },
 sectionTitle: {
   fontSize: 24,
   fontWeight: 'bold',
   color: theme.colors.text.primary,
   marginBottom: theme.spacing.xs,
 },
 sectionSubtitle: {
   fontSize: 14,
   color: theme.colors.text.muted,
   lineHeight: 20,
 },
 viewAllButton: {
   flexDirection: 'row',
   alignItems: 'center',
   gap: theme.spacing.xs,
 },
 viewAllText: {
   color: theme.colors.accent.gold,
   fontSize: 14,
   fontWeight: '600',
 },
 featuresContainer: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   justifyContent: 'space-between',
   marginTop: theme.spacing.lg,
 },
 featureCard: {
   width: (width - 60) / 2,
   marginBottom: theme.spacing.md,
   borderRadius: theme.borderRadius.lg,
   overflow: 'hidden',
 },
 featureCardGradient: {
   padding: theme.spacing.lg,
   alignItems: 'center',
   minHeight: 140,
   borderWidth: 1,
   borderColor: theme.colors.border.secondary,
 },
 featureIconContainer: {
   width: 56,
   height: 56,
   borderRadius: 28,
   backgroundColor: theme.colors.background.primary,
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom: theme.spacing.sm,
 },
 featureTitle: {
   fontSize: 14,
   fontWeight: '600',
   color: theme.colors.text.primary,
   textAlign: 'center',
   marginBottom: theme.spacing.xs,
 },
 featureText: {
   fontSize: 12,
   color: theme.colors.text.muted,
   textAlign: 'center',
   lineHeight: 16,
 },
 pipesScrollContainer: {
   paddingVertical: theme.spacing.sm,
 },
 pipeCard: {
   width: 180,
   marginRight: theme.spacing.md,
   borderRadius: theme.borderRadius.lg,
   overflow: 'hidden',
 },
 pipeCardGradient: {
   borderWidth: 1,
   borderColor: theme.colors.border.secondary,
 },
 pipeImageContainer: {
   height: 120,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: theme.colors.background.primary,
   position: 'relative',
 },
 discountBadge: {
   position: 'absolute',
   top: theme.spacing.sm,
   right: theme.spacing.sm,
   backgroundColor: theme.colors.error,
   paddingHorizontal: theme.spacing.xs,
   paddingVertical: 2,
   borderRadius: theme.borderRadius.sm,
 },
 discountText: {
   color: theme.colors.text.primary,
   fontSize: 10,
   fontWeight: 'bold',
 },
 pipeInfo: {
   padding: theme.spacing.md,
 },
 pipeName: {
   fontSize: 16,
   fontWeight: 'bold',
   color: theme.colors.text.primary,
   marginBottom: theme.spacing.xs,
 },
 ratingContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: theme.spacing.sm,
 },
 starsContainer: {
   flexDirection: 'row',
   marginRight: theme.spacing.xs,
 },
 reviewText: {
   fontSize: 12,
   color: theme.colors.text.muted,
 },
 tagsContainer: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   marginBottom: theme.spacing.sm,
   gap: theme.spacing.xs,
 },
 tag: {
   backgroundColor: theme.colors.accent.gold + '20',
   paddingHorizontal: theme.spacing.xs,
   paddingVertical: 2,
   borderRadius: theme.borderRadius.sm,
   borderWidth: 1,
   borderColor: theme.colors.accent.gold + '40',
 },
 tagText: {
   fontSize: 10,
   color: theme.colors.accent.gold,
   fontWeight: '500',
 },
 priceContainer: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 pipePrice: {
   fontSize: 18,
   fontWeight: 'bold',
   color: theme.colors.accent.gold,
 },
 originalPrice: {
   fontSize: 14,
   color: theme.colors.text.muted,
   textDecorationLine: 'line-through',
   marginLeft: theme.spacing.xs,
 },
 testimonialsContainer: {
   marginTop: theme.spacing.lg,
   gap: theme.spacing.md,
 },
 testimonialCard: {
   borderRadius: theme.borderRadius.lg,
   overflow: 'hidden',
 },
 testimonialGradient: {
   padding: theme.spacing.lg,
   borderWidth: 1,
   borderColor: theme.colors.border.secondary,
 },
 quoteIcon: {
   marginBottom: theme.spacing.sm,
 },
 testimonialText: {
   fontSize: 16,
   color: theme.colors.text.secondary,
   lineHeight: 24,
   fontStyle: 'italic',
   marginBottom: theme.spacing.md,
 },
 testimonialAuthor: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
 },
 authorName: {
   fontSize: 14,
   color: theme.colors.accent.gold,
   fontWeight: '600',
 },
 ctaSection: {
   padding: theme.spacing.lg,
   paddingBottom: theme.spacing.xxl,
 },
 ctaContainer: {
   padding: theme.spacing.xl,
   borderRadius: theme.borderRadius.xl,
   alignItems: 'center',
   borderWidth: 1,
   borderColor: theme.colors.border.primary,
 },
 ctaTitle: {
   fontSize: 24,
   fontWeight: 'bold',
   color: theme.colors.text.primary,
   marginTop: theme.spacing.md,
   marginBottom: theme.spacing.xs,
 },
 ctaDescription: {
   fontSize: 16,
   color: theme.colors.text.muted,
   textAlign: 'center',
   lineHeight: 22,
   marginBottom: theme.spacing.xl,
 },
 ctaButtons: {
   width: '100%',
   gap: theme.spacing.md,
 },
 primaryButton: {
   borderRadius: theme.borderRadius.lg,
   overflow: 'hidden',
 },
 buttonGradient: {
   paddingVertical: theme.spacing.md,
   alignItems: 'center',
 },
 primaryButtonText: {
   color: theme.colors.background.primary,
   fontSize: 16,
   fontWeight: 'bold',
 },
 secondaryButton: {
   borderWidth: 2,
   borderColor: theme.colors.accent.gold,
   borderRadius: theme.borderRadius.lg,
   paddingVertical: theme.spacing.md,
   alignItems: 'center',
 },
 secondaryButtonText: {
   color: theme.colors.accent.gold,
   fontSize: 16,
   fontWeight: 'bold',
 },
});
