@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Edit Purchase Record</div>

                <div class="card-body">
                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <ul class="mb-0">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form method="POST" action="{{ route('buys.update', ['user_id' => $buy->user_id, 'ticket_id' => $buy->ticket_id]) }}">
                        @csrf
                        @method('PUT')

                        <div class="form-group row mb-3">
                            <label class="col-md-4 col-form-label text-md-right">User</label>

                            <div class="col-md-6">
                                <input type="text" class="form-control" value="{{ $buy->user->name ?? $buy->user_id }}" readonly>
                                <small class="text-muted">User cannot be changed</small>
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label class="col-md-4 col-form-label text-md-right">Ticket</label>

                            <div class="col-md-6">
                                <input type="text" class="form-control" value="{{ $buy->ticket->title ?? $buy->ticket_id }}" readonly>
                                <small class="text-muted">Ticket cannot be changed</small>
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label for="purchase_date" class="col-md-4 col-form-label text-md-right">Purchase Date</label>

                            <div class="col-md-6">
                                <input id="purchase_date" type="date" class="form-control @error('purchase_date') is-invalid @enderror"
                                       name="purchase_date" value="{{ old('purchase_date', $buy->purchase_date ? $buy->purchase_date->format('Y-m-d') : '') }}">

                                @error('purchase_date')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    Update
                                </button>
                                <a href="{{ route('buys.index') }}" class="btn btn-secondary">
                                    Cancel
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    update
                                </button>
                                <a href="{{ route('buys.index') }}" class="btn btn-secondary">
                                    Cancel
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
