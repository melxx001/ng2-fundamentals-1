import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Sessions, restrictedWords } from '../shared/index';

@Component({
    selector: 'create-session',
    styles: [`
        em { float: right; color: red; padding-left: 10px }
        .error input, .error select, .error textarea { background-color: red; }
        .error ::-webkit-input-placeholder { color: #999 }
        .error ::-moz-placeholder { color: #999 }
        .error :-moz-placeholder { color: #999 }
        .error :ms-input-placeholder { color: #999 }
    `],
    template: `
        <div class="col-md-12">
        <h3>Create Session</h3>
        </div>
        <div class="col-md-6">
        <form [formGroup]="newSessionForm" (ngSubmit)="saveSession(newSessionForm.value)" autocomplete="off">
            <div class="form-group" [ngClass]="{ 'error': name.invalid && name.dirty }">
            <label for="sessionName">Session Name:</label>
            <em *ngIf="name.invalid && name.dirty">Required</em>
            <input formControlName="name" id="sessionName" type="text" class="form-control" placeholder="session name..." />
            </div>
            <div class="form-group" [ngClass]="{ 'error': presenter.invalid && presenter.dirty }">
            <label for="eventDate">Presenter:</label>
            <em *ngIf="presenter.invalid && presenter.dirty">Required</em>
            <input formControlName="presenter" id="presenter" type="text" class="form-control" placeholder="presenter..." />
            </div>
            <div class="form-group" [ngClass]="{ 'error': duration.invalid && duration.dirty }">
            <label for="duration">Duration:</label>
            <em *ngIf="duration.invalid && duration.dirty">Required</em>
            <select formControlName="duration" id="duration" class="form-control">
                <option value="">select duration...</option>
                <option value="1">Half Hour</option>
                <option value="2">1 Hour</option>
                <option value="3">Half Day</option>
                <option value="4">Full Day</option>
            </select>
            </div>
            <div class="form-group" [ngClass]="{ 'error': level.invalid && level.dirty }">
            <label for="level">Level:</label>
            <em *ngIf="level.invalid && level.dirty">Required</em>
            <select formControlName="level" id="level" class="form-control">
                <option value="">select level...</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>
            </div>
            <div class="form-group" [ngClass]="{ 'error': abstract.invalid && abstract.dirty }">
            <label for="abstract">Abstract:</label>
            <em *ngIf="abstract.invalid && abstract.dirty && abstract?.errors.required">Required</em>
            <em *ngIf="abstract.invalid && abstract.dirty && abstract?.errors.maxLength">Required</em>
            <em *ngIf="abstract.invalid && abstract.dirty && abstract?.errors.restrictedWords">Restricted words found: {{abstract.errors.restrictedWords}}</em>
            <textarea formControlName="abstract" id="abstract" rows=3 class="form-control" placeholder="abstract..."></textarea>
            </div>
            <button type="submit" [disabled]="newSessionForm.invalid" class="btn btn-primary">Save</button>
            <button type="button" (click)="cancel()" class="btn btn-default">Cancel</button>
        </form>
        </div>
    `
})
export class CreateSessionComponent implements OnInit {
    name: FormControl;
    presenter: FormControl;
    duration: FormControl;
    level: FormControl;
    abstract: FormControl;
    newSessionForm: FormGroup;

    @Output() saveNewSession = new EventEmitter();
    @Output() cancelAddSession = new EventEmitter();

    ngOnInit() {
        this.name = new FormControl('', Validators.required);
        this.presenter = new FormControl('', Validators.required);
        this.duration = new FormControl('', Validators.required);
        this.level = new FormControl('', Validators.required);
        this.abstract = new FormControl('', [Validators.required, Validators.maxLength(400), restrictedWords(['foo', 'bar'])]);

        this.newSessionForm = new FormGroup({
            name: this.name,
            presenter: this.presenter,
            duration: this.duration,
            level: this.level,
            abstract: this.abstract
        });
    }

    saveSession(formValues) {
        let session: any = {
            id: undefined,
            name: formValues.name,
            duration: +formValues.duration,
            level: formValues.level,
            presenter: formValues.presenter,
            abstract: formValues.abstract,
            voters: []
        };

        this.saveNewSession.emit(session);
    }

    cancel() {
        this.cancelAddSession.emit();
    }
}