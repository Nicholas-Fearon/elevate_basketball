import test from 'node:test';
import assert from 'node:assert/strict';
import {bookingErrorMessage} from '../lib/booking-errors.mjs';
test('maps booking business errors',()=>{assert.match(bookingErrorMessage({message:'CAMP_FULL'}),/filled up/);assert.match(bookingErrorMessage({message:'AGE_NOT_ELIGIBLE'}),/age/);});
test('distinguishes auth, permission and missing function errors',()=>{assert.match(bookingErrorMessage({code:'PGRST301'}),/sign-in/);assert.match(bookingErrorMessage({code:'42501'}),/authorise/);assert.match(bookingErrorMessage({code:'PGRST202'}),/not ready/);});
test('never exposes raw database details or arbitrary error codes',()=>{const text=bookingErrorMessage({message:'secret participant data',details:'private',code:'sensitive@example.com'});assert.doesNotMatch(text,/secret|private|sensitive/);});
test('unknown errors preserve safe code without claiming booking failure',()=>{assert.match(bookingErrorMessage({code:'23505'}),/23505/);assert.match(bookingErrorMessage({code:'23505'}),/if it was saved/);});
test('incomplete success response warns that booking may exist',()=>{assert.match(bookingErrorMessage({message:'INVALID_CONFIRMATION'}),/may already be reserved/);});
