import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {mentorService} from '../../services/mentorService';
import {getErrorMessage} from '../../services/api';
import {AppMentor, Category, normalizeMentor} from '../../utils/mentor';

const PAGE_SIZE = 10;

type MentorState = {
  items: AppMentor[];
  featured: AppMentor[];
  categories: Category[];
  selected: AppMentor | null;
  page: number;
  hasMore: boolean;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
  saved: string[];
};

const initialState: MentorState = {
  items: [],
  featured: [],
  categories: [],
  selected: null,
  page: 1,
  hasMore: true,
  loading: false,
  detailLoading: false,
  error: null,
  saved: [],
};

export const fetchMentors = createAsyncThunk(
  'mentors/fetch',
  async (
    {page = 1, search, categories}: {page?: number; search?: string; categories?: number[]},
    {rejectWithValue},
  ) => {
    try {
      const res = await mentorService.getMentors(page, PAGE_SIZE, {search, categories});
      const items = (res?.data || []).map(normalizeMentor);
      const total = res?.pagination?.total;
      return {
        page,
        items,
        hasMore: total != null ? page * PAGE_SIZE < total : items.length === PAGE_SIZE,
      };
    } catch (e) {
      return rejectWithValue(getErrorMessage(e, 'Could not load mentors'));
    }
  },
);

export const fetchFeaturedMentors = createAsyncThunk('mentors/featured', async () => {
  const pinned = await mentorService.getPinnedMentors().catch(() => null);
  let list = pinned?.data || [];
  if (!list.length) {
    const res = await mentorService.getMentors(1, 8);
    list = res?.data || [];
  }
  return list.map(normalizeMentor);
});

export const fetchCategories = createAsyncThunk('mentors/categories', async () => {
  const res = await mentorService.getCategories();
  return (res?.data || []) as Category[];
});

export const fetchMentorDetail = createAsyncThunk(
  'mentors/detail',
  async (slug: string, {rejectWithValue}) => {
    try {
      const res = await mentorService.getMentorProfile(slug);
      return normalizeMentor(res?.data);
    } catch (e) {
      return rejectWithValue(getErrorMessage(e, 'Could not load mentor'));
    }
  },
);

const slice = createSlice({
  name: 'mentors',
  initialState,
  reducers: {
    selectMentor: (s, a) => {
      s.selected = a.payload;
    },
    toggleSaved: (s, a) => {
      s.saved = s.saved.includes(a.payload)
        ? s.saved.filter(x => x !== a.payload)
        : [...s.saved, a.payload];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMentors.pending, s => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchMentors.fulfilled, (s, a) => {
        s.loading = false;
        s.page = a.payload.page;
        s.hasMore = a.payload.hasMore;
        s.items = a.payload.page === 1 ? a.payload.items : [...s.items, ...a.payload.items];
      })
      .addCase(fetchMentors.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })
      .addCase(fetchFeaturedMentors.fulfilled, (s, a) => {
        s.featured = a.payload;
      })
      .addCase(fetchCategories.fulfilled, (s, a) => {
        s.categories = a.payload;
      })
      .addCase(fetchMentorDetail.pending, s => {
        s.detailLoading = true;
      })
      .addCase(fetchMentorDetail.fulfilled, (s, a) => {
        s.detailLoading = false;
        // Detail payload has no numeric id; keep the one from the list card.
        s.selected = {...s.selected, ...a.payload, id: s.selected?.id || a.payload.id};
      })
      .addCase(fetchMentorDetail.rejected, s => {
        s.detailLoading = false;
      });
  },
});

export const {selectMentor, toggleSaved} = slice.actions;
export default slice.reducer;
