import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import {useTheme} from '../../theme/useTheme';
import {addReview, addReviewOutcome} from '../../api/reviewApi';
import {showSuccess} from '../../utils/appFeedback';

const defaultReviews = [
  {
    name: 'Priya S.',
    review: 'I came in overwhelmed and left with a plan I could actually act on.',
    rating: 5,
  },
  {
    name: 'Rohan M.',
    review: 'Warm, candid advice that helped me name what mattered.',
    rating: 5,
  },
  {
    name: 'Tanvi K.',
    review: 'A generous listener with very practical insights.',
    rating: 5,
  },
];

export default function MentorReviewsScreen({route, navigation}: any) {
  const {theme} = useTheme();
  const sessionId = route.params?.session_id;
  const mentor = route.params?.mentor;

  const [reviewsList, setReviewsList] = useState(defaultReviews);
  const [showAddForm, setShowAddForm] = useState(Boolean(sessionId));
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      setError('Please share a few words about your experience.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await addReview({
        session_id: sessionId || '1',
        rating: String(rating),
        review: reviewText.trim(),
      });

      // Submit internal outcome goal score as well
      addReviewOutcome({
        session_id: sessionId || '1',
        rating,
        feedback: reviewText.trim(),
      }).catch(() => {});

      setReviewsList(prev => [
        {
          name: 'You',
          review: reviewText.trim(),
          rating,
        },
        ...prev,
      ]);

      showSuccess(
        'Your review has been submitted and helps others choose the right mentor.',
        'Thank You!',
      );
      setReviewText('');
      setShowAddForm(false);
    } catch (err: any) {
      setError(
        err?.message ||
        err?.data?.message ||
        'Unable to submit review right now. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <CustomHeader
        title="Reviews"
        showBack
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.wrap, {padding: theme.spacing.lg}]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              {color: theme.colors.text, fontFamily: theme.fonts.bold},
            ]}>
            What mentees say
          </Text>
          {!showAddForm && (
            <Pressable
              onPress={() => setShowAddForm(true)}
              style={[
                styles.addReviewBtn,
                {backgroundColor: theme.colors.surfaceMuted},
              ]}>
              <Text
                style={[
                  styles.addReviewBtnText,
                  {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
                ]}>
                + Add review
              </Text>
            </Pressable>
          )}
        </View>

        {showAddForm && (
          <View
            style={[
              styles.formCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text
              style={[
                styles.formTitle,
                {color: theme.colors.text, fontFamily: theme.fonts.bold},
              ]}>
              Leave feedback {mentor?.name ? `for ${mentor.name}` : ''}
            </Text>

            {error ? <ErrorMessage message={error} /> : null}

            {/* Star selector */}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <Pressable
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starTouch}>
                  <Text
                    style={[
                      styles.starIcon,
                      {
                        color:
                          star <= rating
                            ? theme.colors.star
                            : theme.colors.mutedText,
                      },
                    ]}>
                    ★
                  </Text>
                </Pressable>
              ))}
            </View>

            <Input
              label="Your review"
              value={reviewText}
              onChangeText={(val: string) => {
                setReviewText(val);
                if (error) setError(null);
              }}
              multiline
              numberOfLines={3}
              placeholder="How was the session? Did you get the clarity you needed?"
            />

            <View style={styles.btnRow}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowAddForm(false)}
                style={{flex: 1}}
              />
              <Button
                title="Submit"
                loading={submitting}
                disabled={submitting}
                onPress={handleSubmitReview}
                style={{flex: 1}}
              />
            </View>
          </View>
        )}

        {reviewsList.map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text style={[styles.stars, {color: theme.colors.star}]}>
              {'★'.repeat(item.rating)}
            </Text>
            <Text
              style={[
                styles.copy,
                {color: theme.colors.text, fontFamily: theme.fonts.regular},
              ]}>
              "{item.review}"
            </Text>
            <Text
              style={[
                styles.name,
                {color: theme.colors.mutedText, fontFamily: theme.fonts.bold},
              ]}>
              {item.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
  },
  addReviewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addReviewBtnText: {
    fontSize: 13,
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  starTouch: {
    padding: 4,
  },
  starIcon: {
    fontSize: 28,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  stars: {
    fontSize: 16,
    letterSpacing: 2,
  },
  copy: {
    fontSize: 15,
    lineHeight: 23,
    marginVertical: 10,
  },
  name: {
    fontSize: 13,
  },
});
