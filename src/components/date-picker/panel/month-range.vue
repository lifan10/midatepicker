<template>
    <div :class="classes">
        <div :class="[prefixCls + '-sidebar']" v-if="shortcuts.length">
            <div
                :class="[prefixCls + '-shortcut']"
                v-for="shortcut in shortcuts"
                @click="handleShortcutClick(shortcut)">{{ shortcut.text }}</div>
        </div>
        <div :class="[prefixCls + '-body']">
            <div :class="[prefixCls + '-content', prefixCls + '-content-left']" v-show="!isTime">
                <div :class="[datePrefixCls + '-header']" v-show="leftCurrentView !== 'time'">
                    <span
                        :class="iconBtnCls('prev', '-double')"
                        @click="prevYear('left')"><Icon type="ios-arrow-left"></Icon></span>
                    <span
                        :class="[datePrefixCls + '-header-label']"
                        @click="showYearPicker('left')">{{ leftYearLabel }}</span>
                </div>
                <year-table
                    ref="leftYearTable"
                    v-show="leftCurrentView === 'year'"
                    :year="leftTableYear"
                    :date="leftTableDate"
                    selection-mode="range"
                    :disabled-date="disabledDate"
                    @on-pick="handleLeftYearPick"
                    @on-pick-click="handlePickClick"></year-table>
                <month-table
                    ref="leftMonthTable"
                    v-show="leftCurrentView === 'month'"
                    :year="leftYear"
                    :month="leftMonth"
                    :date="date"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :range-state="rangeState"
                    selection-mode="range"
                    :disabled-date="disabledDate"
                    @on-changerange="handleChangeRange"
                    @on-pick="handleRangePick"
                    @on-pick-click="handlePickClick"></month-table>
            </div>
            <div :class="[prefixCls + '-content', prefixCls + '-content-right']" v-show="!isTime">
                <div :class="[datePrefixCls + '-header']" v-show="rightCurrentView !== 'time'">
                    <span
                        :class="[datePrefixCls + '-header-label']"
                        @click="showYearPicker('right')">{{ rightYearLabel }}</span>
                    <span
                        :class="iconBtnCls('next', '-double')"
                        @click="nextYear('right')"><Icon type="ios-arrow-right"></Icon></span>
                </div>
                <year-table
                    ref="rightYearTable"
                    v-show="rightCurrentView === 'year'"
                    :year="rightTableYear"
                    :date="rightTableDate"
                    selection-mode="range"
                    :disabled-date="disabledDate"
                    @on-pick="handleRightYearPick"
                    @on-pick-click="handlePickClick"></year-table>
                <month-table
                    ref="rightMonthTable"
                    v-show="rightCurrentView === 'month'"
                    :year="rightYear"
                    :month="rightMonth"
                    :date="rightDate"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :range-state="rangeState"
                    selection-mode="range"
                    :disabled-date="disabledDate"
                    @on-changerange="handleChangeRange"
                    @on-pick="handleRangePick"
                    @on-pick-click="handlePickClick"></month-table>
            </div>
            <div :class="[prefixCls + '-content']" v-show="isTime">
                <time-picker
                    ref="timePicker"
                    v-show="isTime"
                    @on-pick="handleTimePick"
                    @on-pick-click="handlePickClick"></time-picker>
            </div>
            <Confirm
                v-if="confirm"
                :show-time="showTime"
                :is-time="isTime"
                :time-disabled="timeDisabled"
                @on-pick-toggle-time="handleToggleTime"
                @on-pick-clear="handlePickClear"
                @on-pick-success="handlePickSuccess"></Confirm>
        </div>
    </div>
</template>
<script>
    import Icon from '../ivew-componets/icon/icon.vue';
    import YearTable from '../base/year-table.vue';
    import MonthTable from '../base/monthrange-table.vue';
    import TimePicker from './time-range.vue';
    import Confirm from '../base/confirm.vue';
    import {toDate, prevMonth, nextMonth, initTimeDate, initMonthDate} from '../util';

    import Mixin from './mixin';
    import Locale from '../../date-picker/mixins/locale';
    const prefixCls = 'ivu-picker-panel';
    const datePrefixCls = 'ivu-date-picker';

    export default {
        name: 'DatePicker',
        mixins: [ Mixin, Locale ],
        //components: { Icon, DateTable, YearTable, MonthTable, TimePicker, Confirm },
        components: { Icon,  YearTable, MonthTable, TimePicker, Confirm },
        data () {
            return {
                prefixCls: prefixCls,
                datePrefixCls: datePrefixCls,
                shortcuts: [],
                date: initTimeDate(),
                value: '',
                minDate: '',
                maxDate: '',
                confirm: false,
                rangeState: {
                    endDate: null,
                    selecting: false
                },
                showTime: false,
                disabledDate: '',
                leftCurrentView: 'month',
                rightCurrentView: 'month',
                selectionMode: 'range',
                leftTableYear: null,
                rightTableYear: null,
                isTime: false,
                format: 'yyyy-MM'
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}-body-wrapper`,
                    `${datePrefixCls}-with-range`,
                    {
                        [`${prefixCls}-with-sidebar`]: this.shortcuts.length
                    }
                ];
            },
            leftYear () {
                return this.date.getFullYear();
            },
            leftTableDate () {
                if (this.leftCurrentView === 'year' || this.leftCurrentView === 'month') {
                    return new Date(this.leftTableYear);
                } else {
                    return this.date;
                }
            },
            leftYearLabel () {
                const tYear = this.t('i.datepicker.year');
                if (this.leftCurrentView === 'year') {
                    const year = this.leftTableYear;
                    if (!year) return '';
                    const startYear = Math.floor(year / 10) * 10;
                    return `${startYear}${tYear} - ${startYear + 9}${tYear}`;
                } else {
                    const year = this.leftCurrentView === 'month' ? this.leftTableYear : this.leftYear;
                    if (!year) return '';
                    return `${year}${tYear}`;
                }
            },
            leftMonth () {
                return this.date.getMonth();
            },
            leftMonthLabel () {
                const month = this.leftMonth +1;
                return this.t(`i.datepicker.month${month}`);
            },
            rightYear () {
                return this.rightDate.getFullYear();
            },
            rightTableDate () {
                if (this.rightCurrentView === 'year' || this.rightCurrentView === 'month') {
                    return new Date(this.rightTableYear);
                } else {
                    return this.date;
                }
            },
            rightYearLabel () {
                const tYear = this.t('i.datepicker.year');
                if (this.rightCurrentView === 'year') {
                    const year = this.rightTableYear;
                    if (!year) return '';
                    const startYear = Math.floor(year / 10) * 10;
                    return `${startYear}${tYear} - ${startYear + 9}${tYear}`;
                } else {
                    const year = this.rightCurrentView === 'month' ? this.rightTableYear : this.rightYear;
                    if (!year) return '';
                    return `${year}${tYear}`;
                }
            },
            rightMonth () {
                return this.rightDate.getMonth();
            },
            rightMonthLabel () {
                const month = this.rightMonth + 1;
                return this.t(`i.datepicker.month${month}`);
            },
            //根据左边日历的时间 计算右边日历的时间
            rightDate () {
                const newDate = new Date(this.date);
                const year = newDate.getFullYear()+1;
                newDate.setFullYear(year);
                newDate.setMonth(0);
                newDate.setDate(1);
                return newDate;
            },
            timeDisabled () {
                return !(this.minDate && this.maxDate);
            }
        },
        watch: {
            value(newVal) {
                if (!newVal) {
                    this.minDate = null;
                    this.maxDate = null;
                } else if (Array.isArray(newVal)) {
                    this.minDate = newVal[0] ? toDate(newVal[0]) : null;
                    this.maxDate = newVal[1] ? toDate(newVal[1]) : null;
                    if (this.minDate) this.date = new Date(this.minDate);
                }
                if (this.showTime) this.$refs.timePicker.value = newVal;
                this.value=newVal;
            },
            minDate (val) {
                if (this.showTime) this.$refs.timePicker.date = val;
            },
            maxDate (val) {
                if (this.showTime) this.$refs.timePicker.dateEnd = val;
            },
            format (val) {
                if (this.showTime) this.$refs.timePicker.format = val;
            },
            isTime (val) {
                if (val) this.$refs.timePicker.updateScroll();
            }
        },
        methods: {
            resetDate () {
                this.date = new Date(this.date);
                this.leftTableYear = this.date.getFullYear();
                this.rightTableYear = this.rightDate.getFullYear();
            },
            handleClear() {
                this.minDate = null;
                this.maxDate = null;
                this.date = new Date();
                this.handleConfirm();
                if (this.showTime) this.$refs.timePicker.handleClear();
            },
            resetView(reset = false) {
                this.leftCurrentView = 'month';
                this.rightCurrentView = 'month';

                this.leftTableYear = this.leftYear;
                this.rightTableYear = this.rightYear;

                if (reset) this.isTime = false;
            },
            prevYear (direction) {
                if (this[`${direction}CurrentView`] === 'year') {
                    this.$refs[`${direction}YearTable`].prevTenYear();
                }else{
                    const date = this.date;
                    date.setFullYear(date.getFullYear() - 1);
                    this.resetDate();
                }
            },
            nextYear (direction) {
                if (this[`${direction}CurrentView`] === 'year') {
                    this.$refs[`${direction}YearTable`].nextTenYear();
                }else{
                    const date = this.date;
                    date.setFullYear(date.getFullYear() + 1);
                    this.resetDate();
                }
            },
            prevMonth () {
                this.date = prevMonth(this.date);
            },
            nextMonth () {
                this.date = nextMonth(this.date);
            },
            handleLeftYearPick (year, close = true) {
                this.handleYearPick(year, close, 'left');
            },
            handleRightYearPick (year, close = true) {
                this.handleYearPick(year, close, 'right');
            },
            handleYearPick (year, close, direction) {
                //月区间----选年的时候 统一左右时间
                this[`${direction}TableYear`] = year;
                if (!close) return;
                if(direction=='right'){
                    this.date.setYear(year-1);
                }else{
                    this.date.setYear(year);
                }
                this.resetDate();
                this[`${direction}CurrentView`] = 'month';
            },
            handleLeftMonthPick (month) {
                this.handleMonthPick(month, 'left');
            },
            handleRightMonthPick (month){
                this.handleMonthPick(month, 'right');
            },
            handleMonthPick (month, direction) {
                let year = this[`${direction}TableYear`];
                if (direction === 'right') {
                    if (month === 0) {
                        month = 11;
                        year--;
                    } else {
                        month--;
                    }
                }

                this.date.setYear(year);
                this.date.setMonth(month);
                this[`${direction}CurrentView`] = 'date';
                this.resetDate();
            },
            showYearPicker (direction) {
                this[`${direction}CurrentView`] = 'year';
                this[`${direction}TableYear`] = this[`${direction}Year`];
            },
            showMonthPicker (direction) {
                this[`${direction}CurrentView`] = 'month';
            },
            handleConfirm(visible) {
                this.$emit('on-pick', [this.minDate, this.maxDate], visible);
            },
            //on-pick
            handleRangePick (val, close = true) {
                if (this.maxDate === val.maxDate && this.minDate === val.minDate) return;

                this.minDate = val.minDate;
                this.maxDate = val.maxDate;

                if (!close) return;
                this.handleConfirm(false);
            },
            handleChangeRange (val) {
                this.minDate = val.minDate;
                this.maxDate = val.maxDate;
                this.rangeState = val.rangeState;
            },
            handleToggleTime () {
                this.isTime = !this.isTime;
            },
            handleTimePick (date) {
                this.minDate = date[0];
                this.maxDate = date[1];
                this.handleConfirm(false);
            }
        },
        mounted () {
            if (this.showTime) {
                // todo 这里也到不了
                this.$refs.timePicker.date = this.minDate;
                this.$refs.timePicker.dateEnd = this.maxDate;
                this.$refs.timePicker.value = this.value;
                this.$refs.timePicker.format = this.format;
                this.$refs.timePicker.showDate = true;
            }
        }
    };
</script>
